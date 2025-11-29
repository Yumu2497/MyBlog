import { useState, useEffect } from 'react';
import { useUser, SignIn, SignUp } from '@clerk/nextjs';

export default function GlobalAuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const { isLoaded, isSignedIn } = useUser();

    // 监听用户登录状态变化，自动关闭模态框
    useEffect(() => {
        if (isLoaded && isSignedIn && isOpen) {
            setIsOpen(false);
        }
    }, [isLoaded, isSignedIn, isOpen]);

    const openModal = (authMode = 'signin') => {
        setMode(authMode);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    // 将 openModal 函数挂载到 window 对象上，以便全局调用
    useEffect(() => {
        window.openAuthModal = openModal;
        return () => {
            delete window.openAuthModal;
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={closeModal}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <h2>{mode === 'signin' ? '登录' : '注册'}</h2>
                    <button className="auth-modal-close" onClick={closeModal}>
                        ×
                    </button>
                </div>

                <div className="auth-modal-body">
                    {/* 使用 hash 路由模式 */}
                    {mode === 'signin' ? (
                        <SignIn
                            routing="hash"
                            fallbackRedirectUrl="/"
                        />
                    ) : (
                        <SignUp
                            routing="hash"
                            fallbackRedirectUrl="/"
                        />
                    )}
                </div>

                <div className="auth-modal-footer">
                    {mode === 'signin' ? (
                        <p>
                            还没有账户？{' '}
                            <button
                                type="button"
                                className="auth-modal-switch"
                                onClick={() => setMode('signup')}
                            >
                                立即注册
                            </button>
                        </p>
                    ) : (
                        <p>
                            已有账户？{' '}
                            <button
                                type="button"
                                className="auth-modal-switch"
                                onClick={() => setMode('signin')}
                            >
                                立即登录
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}