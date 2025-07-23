import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import ProjectForm from '@/modules/home/ui/components/project-form'
import ProjectsList from '@/modules/home/ui/components/projects-list'

const Page = () => {
  return (
    <div className='mx-auto flex max-h-screen min-h-screen w-full max-w-5xl flex-col'>
      <section className='flex flex-1 flex-col justify-center space-y-6 py-12'>
        <div className='flex flex-col items-center'>
          <ThemeResponsiveLogo
            src='/logo.svg'
            alt='Vibe'
            width={70}
            height={70}
            className='hidden md:block'
          />
        </div>
        <h1 className='text-center font-mono text-2xl font-semibold md:text-5xl'>
          Build something with Vibe
        </h1>
        <p className='text-muted-foreground text-center text-lg md:text-xl'>
          Create apps and websites by chatting with AI
        </p>
        <div className='mx-auto w-full max-w-3xl'>
          <ProjectForm />
        </div>
      </section>
      <section className='pb-12'>
        <div className='mx-auto w-full max-w-5xl'>
          <ProjectsList />
        </div>
      </section>
    </div>
  )
}

export default Page
