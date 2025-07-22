import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder
} from 'vscode-icons-js'

export function getFileIcon(fileName: string): string {
  return getIconForFile(fileName) || 'file.svg'
}

export function getFolderIcon(folderName: string, isOpen = false): string {
  const icon = isOpen
    ? getIconForOpenFolder(folderName)
    : getIconForFolder(folderName)
  return icon || 'folder.svg'
}

export function getIconUrl(iconName: string): string {
  return `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${iconName}`
}
