interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <main className='flex flex-col'>
      <div className='bg-background fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#dadde2,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)]' />
      <div className='flex min-h-screen flex-1 flex-col px-4 pb-4'>
        {children}
      </div>
    </main>
  )
}

export default Layout
