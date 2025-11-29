import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

/**
 * 网站顶部
 * @returns
 */
export default function Header(props) {
  const { siteInfo } = props

  return (
    <header className='text-center justify-between items-center px-6 bg-white h-80 dark:bg-black relative z-10'>
      <div className='float-none inline-block py-12'>
        <SmartLink href='/'>
          {/* 可使用一张单图作为logo */}
          <div className='flex space-x-6 justify-center'>
            <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer justify-center items-center flex'>
              <LazyImage
                priority={true}
                src={siteInfo?.icon}
                className='rounded-full'
                width={100}
                height={100}
                alt={siteConfig('AUTHOR')}
              />
            </div>

            <div className='flex-col flex justify-center'>
              <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>
                {siteConfig('AUTHOR')}
              </div>
              <div
                className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center'
                dangerouslySetInnerHTML={{
                  __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
                }}
              />
            </div>
          </div>
        </SmartLink>

        <div className='flex justify-center'>
          <SocialButton />
        </div>
        <div className='text-xs mt-4 text-gray-500 dark:text-gray-300'>
          {siteConfig('DESCRIPTION')}
        </div>

        {/* 用户认证按钮 */}
        <div className='absolute top-4 right-4'>
          <SignedOut>
            <div className='flex space-x-2'>
              <button
                onClick={() => window.openAuthModal && window.openAuthModal('signin')}
                className='px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300
      dark:hover:bg-gray-600 transition-colors'
              >
                登录
              </button>
              <button
                onClick={() => window.openAuthModal && window.openAuthModal('signup')}
                className='px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-sm
      hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors'
              >
                注册
              </button>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
