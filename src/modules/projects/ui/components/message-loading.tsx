import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { useEffect, useState } from 'react'

const ShimmerMessages = () => {
  const messages = [
    'Vibing...',
    'Building something else entirely...',
    'Flibbertigibbeting...',
    'Cooking...',
    'Making a mess...',
    'Doing AI stuff...',
    'Final touches...',
    'Almost there...',
    'Thinking really hard...',
    'Consulting the rubber duck...',
    'Untangling spaghetti code...',
    'Summoning the code spirits...',
    'Caffeinating the algorithms...',
    'Teaching rocks to think...',
    'Debugging in production (shh)...',
    'Converting coffee to code...',
    'Asking Stack Overflow...',
    'Questioning life choices...',
    'Spinning up the hamster wheel...',
    'Channeling inner wisdom...',
    'Convincing pixels to cooperate...',
    'Herding digital cats...',
    'Negotiating with semicolons...',
    'Practicing dark magic...',
    'Refactoring the universe...'
  ]

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * messages.length)
        } while (newIndex === prev && messages.length > 1)
        return newIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className='flex items-center gap-2'>
      <span className='text-muted-foreground animate-pulse text-base'>
        {messages[currentMessageIndex]}
      </span>
    </div>
  )
}

const MessageLoading = () => {
  return (
    <div className='group flex flex-col px-2 pb-4'>
      <div className='mb-2 flex items-center gap-2 pl-2'>
        <ThemeResponsiveLogo
          className='h-8 w-8'
          aria-label='Wolf Logo'
          role='img'
        />
        <span className='text-sm font-medium'>Vibe</span>
      </div>
      <div className='flex flex-col gap-y-4 pl-8.5'>
        <ShimmerMessages />
      </div>
    </div>
  )
}

export default MessageLoading
