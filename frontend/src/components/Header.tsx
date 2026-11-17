import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-[#6645F5] text-white'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
        <a href='#' className='flex items-center gap-2'>
          <Image
            src='/images/logo-no-title.png'
            alt=''
            width={44}
            height={44}
            className='shrink-0 rounded-3xl'
          />
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
