import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'

/**
  * Giscus评论 @see https://giscus.app/zh-CN
  * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
  * @returns {JSX.Element}
  * @constructor
 */

const Twikoo = ({ isDarkMode }) => {
  const envId = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const el = siteConfig('COMMENT_TWIKOO_ELEMENT_ID', '#twikoo')
  const twikooCDNURL = siteConfig('COMMENT_TWIKOO_CDN_URL')
  const lang = siteConfig('LANG')
  const [isInit] = useState(useRef(false))

  const { isLoaded, isSignedIn, user } = useUser()

  const loadTwikoo = async () => {
    try {
      await loadExternalResource(twikooCDNURL, 'js')
      const twikoo = window?.twikoo
      if (
        typeof twikoo !== 'undefined' &&
        twikoo &&
        typeof twikoo.init === 'function'
      ) {
        twikoo.init({
          envId: envId, // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
          el: el, // 容器元素
          lang: lang // 用于手动设定评论区语言，支持的语言列表https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
          })
        console.log('twikoo init', twikoo)
        isInit.current = true
      }
    } catch (error) {
      console.error('twikoo 加载失败', error)
    }
  }

  // 在用户状态变化时更新Twikoo表单
  useEffect(() => {
    if (isLoaded && isSignedIn && user && window.twikoo) {
      // 等待Twikoo初始化完成
      const checkTwikooReady = setInterval(() => {
        // 查找Twikoo表单元素
        const nickInput = document.querySelector('input[name="nick"]')
        const mailInput = document.querySelector('input[name="mail"]')

        if (nickInput && mailInput && isInit.current) {
          clearInterval(checkTwikooReady)

          // 设置用户信息
          if (nickInput && !nickInput.value) {
            nickInput.value = user.fullName || user.emailAddresses[0]?.emailAddress || ''
            nickInput.dispatchEvent(new Event('input', { bubbles: true }))
            nickInput.dispatchEvent(new Event('change', { bubbles: true }))
          }
          if (mailInput && !mailInput.value) {
            mailInput.value = user.emailAddresses[0]?.emailAddress || ''
            mailInput.dispatchEvent(new Event('input', { bubbles: true }))
            mailInput.dispatchEvent(new Event('change', { bubbles: true }))
          }
        }
      }, 500)

      // 设置一个最大等待时间
      setTimeout(() => {
        clearInterval(checkTwikooReady)
      }, 10000) // 10秒后停止检查
    }
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isInit.current) {
        console.log('twioo init! clear interval')
        clearInterval(interval)
      } else {
        loadTwikoo()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isDarkMode])

  return <div id="twikoo"></div>
}

export default Twikoo
