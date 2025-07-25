import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import './code-theme.css'
import { useEffect } from 'react'

interface Props {
  code: string
  language: string
}

const CodeView = ({ code, language }: Props) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <pre className='m-0 rounded-none border-none bg-transparent p-2 text-xs'>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  )
}

export default CodeView
