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
          to Your NextJS Apps
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
      <section className='bg-background-secondary py-20 max-lg:py-10'>
        <div className='mx-auto grid max-w-screen-lg grid-cols-3 gap-7 px-8 py-5 max-lg:max-w-fit max-lg:grid-cols-1 max-lg:gap-10'>
          <div className='text-center'>
            <h2 className='mb-3  text-xl font-semibold'>Approachable</h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
                Add components without sending additional client side JavaScript Built on the latest React features
            </p>
          </div>
          <div className='text-center'>
            <h2 className='mb-3 text-xl font-semibold'>Versatile</h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
                Automatic Image Font and Script Optimizations for improved UX and Core Web Vitals
            </p>
          </div>
          <div className='text-center'>
            <h2 className='mb-3 text-xl font-semibold'>Performant</h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
                A rich incredibly adoptable template that scales between a small showcase website and a full size app
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}