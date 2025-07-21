import { Button } from '@/components/ui/button'
import { Fragment } from '@/generated/prisma'
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
  data: Fragment
}

const FragmentWeb = ({ data }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const onRefresh = () => {
    setFragmentKey(prev => prev + 1)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='bg-sidebar flex items-center gap-x-2 border-b p-2'>
        <Button
          size='sm'
          variant='outline'
          onClick={onRefresh}
          title='Refresh view'
        >
          <RefreshCcwIcon />
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={handleCopy}
          disabled={!data.sandboxUrl || copied}
          className='flex-1 justify-start text-start font-normal'
          title={copied ? 'Copied successfully!' : 'Click to copy'}
        >
          <span aria-label='Sandbox URL' className='truncate'>
            {data.sandboxUrl}
          </span>
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => {
            if (!data.sandboxUrl) return
            window.open(data.sandboxUrl, '_blank')
          }}
          disabled={!data.sandboxUrl}
          title='Open in new tab'
        >
          <ExternalLinkIcon />
        </Button>
      </div>
      <iframe
        key={fragmentKey}
        className='h-full w-full'
        sandbox='allow-forms allow-scripts allow-same-origin'
        loading='lazy'
        src={data.sandboxUrl}
      />
    </div>
  )
}

export default FragmentWeb
