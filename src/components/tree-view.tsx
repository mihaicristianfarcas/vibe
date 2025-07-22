import { ChevronRightIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail
} from './ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { getFileIcon, getFolderIcon, getIconUrl } from '@/lib/file-icons'
import Image from 'next/image'

export type TreeItem = string | [string, ...TreeItem[]]

interface TreeProps {
  item: TreeItem
  selectedValue?: string | null
  onSelect?: (value: string) => void
  parentPath: string
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item]
  const currentPath = parentPath ? `${parentPath}/${name}` : name

  if (!items.length) {
    // It's a file
    const isSelected = selectedValue === currentPath

    return (
      <SidebarMenuButton
        isActive={isSelected}
        className='data-[active-true]:bg-transparent'
        onClick={() => onSelect?.(currentPath)}
      >
        <Image
          src={getIconUrl(getFileIcon(name))}
          width={16}
          height={16}
          alt=''
          className='h-4 w-4 flex-shrink-0'
        />
        <span className='truncate'>{name}</span>
      </SidebarMenuButton>
    )
  }

  // It's a folder
  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon />
            <Image
              src={getIconUrl(getFolderIcon(name, false))}
              width={16}
              height={16}
              alt=''
              className='flex-shrink-0'
            />
            <span className='truncate'>{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

interface TreeViewProps {
  data: TreeItem[]
  value?: string | null
  onSelect?: (value: string) => void
}

const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible='none' className='w-full'>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=''
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

export default TreeView
