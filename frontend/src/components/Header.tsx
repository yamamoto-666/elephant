import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-[#6645F5] text-white'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
        <a href='#' className='flex items-center gap-2'>
          <span className='text-3xl'>🐘</span>
          <span className='font-semibold'>Elephant English</span>
        </a>

        <nav className='hidden items-center gap-10 md:flex' aria-label='メインナビゲーション'>
          <Link href='#' className='hover:opacity-75'>
            Home
          </Link>

          <Link href='#courses' className='hover:opacity-75'>
            Courses
          </Link>

          <span>AI Chat</span>
        </nav>

        <div className='hidden items-center gap-6 md:flex'>
          <span>Login</span>
          <span>Sign up</span>
        </div>
      </div>
    </header>
  );
}
