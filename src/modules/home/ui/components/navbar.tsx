'use client'

import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { Button } from '@/components/ui/button'
import UserControl from '@/components/user-control'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='border-bottom fixed top-0 right-0 left-0 z-50 border-transparent bg-transparent p-4 transition-all duration-200'>
      <div className='mx-auto flex w-full max-w-5xl items-center justify-between'>
        <Link href='/' className='flex items-center gap-2'>
          <ThemeResponsiveLogo alt='Vibe' width={24} height={24} />
          <span className='font-mono text-xl font-light'>Vibe</span>
        </Link>
        <SignedOut>
          <div className='flex gap-2'>
            <SignUpButton>
              <Button variant='outline' size='sm'>
                Sign up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size='sm'>Sign in</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar
