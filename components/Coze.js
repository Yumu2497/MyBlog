import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {
  const cozeSrc = siteConfig(
    'COZE_SRC_URL',
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js'
  )
  const title = siteConfig('COZE_TITLE', 'NotionNext助手')
  const rawBotId = siteConfig('COZE_BOT_ID')
  const botId = typeof rawBotId === 'string' && rawBotId.startsWith('\\') ? rawBotId.substring(1) : rawBotId

  // 您的认证 Worker URL (请替换为您的实际 URL)
  const WORKER_AUTH_URL = 'https://cozejwt.techyumu.us.kg';
  /**
* 生成唯一的 session_id，并将其存储在 localStorage 中（实现长期保存）。
*/
  function getOrCreatePersistentSessionId() {
    const KEY_NAME = 'coze_session_id';
    let sessionId = localStorage.getItem(KEY_NAME);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(KEY_NAME, sessionId);
      // console.log(`新 Session ID 生成并存储: ${sessionId}`);
    } else {
      // console.log(`使用现有 Session ID: ${sessionId}`);
    }

    return sessionId;
  }

  // 🚀 修复点 1: 必须先获取 Session ID
  const currentSessionId = getOrCreatePersistentSessionId();

  // 生成唯一的 token 存储键名
  function getTokenStorageKey() {
    return `coze_token_${currentSessionId}`;
  }

  // 生成 12 小时后的过期时间戳
  function generateExpiryTime() {
    return Date.now() + 12 * 60 * 60 * 1000; // 12小时 = 12 * 60 * 60 * 1000 毫秒
  }

  // 从本地存储获取 token（如果未过期）
  function getStoredToken() {
    const storageKey = getTokenStorageKey();
    const storedData = localStorage.getItem(storageKey);
    
    if (!storedData) {
      return null;
    }

    try {
      const { token, expiry } = JSON.parse(storedData);
      
      // 检查是否过期
      if (Date.now() > expiry) {
        // token 已过期，删除它
        localStorage.removeItem(storageKey);
        console.log("Coze Token 已过期，已删除");
        return null;
      }
      
      return token;
    } catch (error) {
      console.error("解析存储的 Token 时出错:", error);
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  // 将 token 存储到本地存储中，并设置 12 小时过期时间
  function storeToken(token) {
    const storageKey = getTokenStorageKey();
    const expiryTime = generateExpiryTime();
    const dataToStore = {
      token: token,
      expiry: expiryTime
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    console.log("Coze Token 已存储，将在 12 小时后过期");
  }

  // 核心认证函数：使用 fetch 调用您的 Worker
  async function getCozeToken() {
    // 首先尝试从本地存储获取未过期的 token
    const storedToken = getStoredToken();
    if (storedToken) {
      console.log("使用本地存储的 Coze Token");
      return storedToken;
    }

    try {
      // currentSessionId 现在是可用的
      const response = await fetch(WORKER_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "session_id": currentSessionId // 此时值已确定
        }),
      });

      if (!response.ok) {
        // 改进错误处理，包含 Worker 返回的错误详情
        const errorData = await response.json();
        throw new Error(`Worker 认证失败: ${response.status} - ${errorData.error_message || errorData.error}`);
      }

      const data = await response.json();
      // console.log(data.access_token)
      // console.log("Access Token 获取成功！");

      const token = data.access_token;
      
      // 将新获取的 token 存储到本地，并设置 12 小时过期时间
      storeToken(token);

      return token;
    } catch (error) {
      console.error("认证流程错误:", error);
      // 返回一个空字符串或抛出错误，以便 SDK 处理失败
      throw error;
    }
  }

  const loadAndInitializeCoze = async () => {
    if (!botId) return;

    // 1. 获取初始 Access Token
    let initialToken;
    try {
      initialToken = await getCozeToken();
    } catch (e) {
      console.error("无法获取 Coze 初始 Access Token，聊天机器人将无法加载。", e);
      return; 
    }

    // 2. 加载外部资源
    await loadExternalResource(cozeSrc);
    const CozeWebSDK = window?.CozeWebSDK;
    // console.log(botId)
    
    if (CozeWebSDK && initialToken) {
      // 3. 初始化 SDK，并传入 Token
      const cozeClient = new CozeWebSDK.WebChatClient({
        config: {
          bot_id: botId
        },
        componentProps: {
          title: title
        },
        // 🚀 关键：添加完整的认证配置
        auth: {
            type: 'token',
            // 传入已解析的 Token 字符串
            token: initialToken, 
            // 传入函数引用，用于刷新 Token
            onRefreshToken: getCozeToken 
        },
        userInfo: {
            id: currentSessionId,
            nickname: 'User',
            // url 字段在简化中被移除
        }
      });
      console.log('Coze WebChatClient initialized:', cozeClient);
    }
  }

  // 仅在组件挂载时运行一次
  useEffect(() => {
    loadAndInitializeCoze();
  }, [])
  return <></>
}
