import { Fragment, useCallback, useMemo, useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from './ui/resizable'
import Hint from './hint'
import { Button } from './ui/button'
import { CopyCheckIcon, CopyIcon } from 'lucide-react'
import CodeView from './code-view'
import { convertFilesToTreeItems } from '@/lib/utils'
import TreeView from './tree-view'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { getFileIcon, getIconUrl } from '@/lib/file-icons'
import Image from 'next/image'

type FileCollection = { [path: string]: string }

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension || 'text'
}

interface FileBreadcrumbProps {
  filePath: string
  onBreadcrumbClick: (path: string) => void
  availableFiles: string[]
}

const FileBreadcrumb = ({
  filePath,
  onBreadcrumbClick,
  availableFiles
}: FileBreadcrumbProps) => {
  const pathSegments = filePath.split('/')
  const MAX_SEGMENTS = 4

  const getPathAtIndex = (index: number) => {
    return pathSegments.slice(0, index + 1).join('/')
  }

  // Find direct children files of the clicked folder
  const findFilesForPath = (partialPath: string) => {
    return availableFiles.filter(file => {
      const fileSegments = file.split('/')
      const partialSegments = partialPath.split('/')

      // Only include direct children (exactly one level deeper)
      if (fileSegments.length !== partialSegments.length + 1) return false

      // Check if this file shares the same path up to the partial path length
      for (let i = 0; i < partialSegments.length; i++) {
        if (fileSegments[i] !== partialSegments[i]) return false
      }

      return true
    })
  }

  const BreadcrumbDropdown = ({
    partialPath,
    segment
  }: {
    partialPath: string
    segment: string
  }) => {
    const matchingFiles = findFilesForPath(partialPath)

    if (matchingFiles.length === 0) {
      return <span className='text-muted-foreground'>{segment}</span>
    }

    if (matchingFiles.length === 1) {
      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onBreadcrumbClick(matchingFiles[0])}
        >
          {segment}
        </Button>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm'>
            {segment}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='max-h-64 overflow-y-auto'>
          {matchingFiles.map(filePath => {
            const fileName = filePath.split('/').pop() || filePath
            return (
              <DropdownMenuItem
                key={filePath}
                onClick={() => onBreadcrumbClick(filePath)}
                className='flex cursor-pointer items-center gap-2'
              >
                <Image
                  src={getIconUrl(getFileIcon(fileName))}
                  width={16}
                  height={16}
                  alt=''
                  className='flex-shrink-0'
                />
                {fileName}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= MAX_SEGMENTS) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1
        const partialPath = getPathAtIndex(index)

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className='font-medium'>
                  {segment}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbDropdown
                  partialPath={partialPath}
                  segment={segment}
                />
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        )
      })
    } else {
      const firstSegment = pathSegments[0]
      const lastSegment = pathSegments[pathSegments.length - 1]
      const firstPath = pathSegments[0]

      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbDropdown
              partialPath={firstPath}
              segment={firstSegment}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='font-medium'>
              {lastSegment}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  )
}

interface FileExplorerProps {
  files: FileCollection
}

const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files)
    return fileKeys.length > 0 ? fileKeys[0] : null
  })
  const [copied, setCopied] = useState(false)

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files)
  }, [files])

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath)
      }
    },
    [files]
  )

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [selectedFile, files])

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={75} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className='flex h-full w-full flex-col'>
            <div className='bg-background flex items-center justify-between gap-x-2 border-b px-2 py-2'>
              <FileBreadcrumb
                filePath={selectedFile}
                onBreadcrumbClick={handleFileSelect}
                availableFiles={Object.keys(files)}
              />
              <Hint text='Copy to clipboard' side='bottom'>
                <Button
                  variant='outline'
                  size='sm'
                  className='ml-auto'
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className='flex-1 overflow-auto'>
              <CodeView
                code={files[selectedFile]}
                language={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            <p>Select a file to view it&apos;s content</p>
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={15} className='bg-sidebar'>
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default FileExplorer
