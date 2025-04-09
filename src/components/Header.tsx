'use client'
import ThemeSwitch from './ThemeSwitch'

export const Header = () => {
  return (
    <div className='mx-auto flex max-w-screen-2xl flex-row items-center justify-between p-5'>
      <div className='flex flex-row items-center gap-3'>
        <ThemeSwitch />
      </div>
    </div>
  )
}