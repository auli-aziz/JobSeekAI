import Button from '~/components/Button'

export default function DashboardPage() {
  return (
    <div>
      <section className='flex flex-col items-center justify-center py-24'>
        <h1 className='text-center text-7xl font-extrabold leading-tight'>
          A{' '}
          <span className='bg-span-bg bg-clip-text text-transparent'>
            Booster
          </span>
          <br />
          to Find Your Dream Job
        </h1>
        <div className='my-6 px-20 text-center text-2xl text-text-secondary'>
          An approachable performant and versatile boilerplate for building SSR applications
        </div>
        <div className='mt-4 flex flex-row gap-4'>
          <a
            href='https://github.com/new?template name=nextjs-template&template owner=yahyaparvar'
            target=' blank'
          >
            <Button rounded size='large'>
              Use Template
            </Button>
          </a>
          <a
            href='https://github.com/yahyaparvar/nextjs-template'
            target=' blank'
          >
            <Button rounded size='large' variant='secondary'>
              Learn More
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}