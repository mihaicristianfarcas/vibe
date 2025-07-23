'use client'

import useCurrentTheme from '@/hooks/use-current-theme'
import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Page = () => {
  const currentTheme = useCurrentTheme()
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col'>
      <section className='2xl-pt-48 space-y-6 pt-[16vh]'>
        <div className='flex flex-col items-center'>
          <SignUp
            appearance={{
              baseTheme: currentTheme === 'dark' ? dark : undefined,
              elements: {
                cardBox: 'border! shadow-none! rounded-lg!'
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default Page
