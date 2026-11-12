import Image from 'next/image';
import Link from 'next/link';

const menus = [
  'Progress',
  'Review',
  'Vocabulary',
  'Favorites',
  'Streak',
];

export default function Sidebar() {
  return (
    <aside
      className='flex w-full flex-col bg-[#07164C] bg-cover bg-bottom bg-no-repeat px-8 py-8 text-white md:min-h-screen md:w-56 md:shrink-0'
      style={{
        backgroundImage: "url('/images/background.png')",
      }}
    >
      <Link href='/' className='mb-8 flex justify-center'>
          <Image 
            src='/images/logo-no-title.png'
            alt='Elephant English Logo'
            width={80}
            height={80}
            className='rounded-full'
          />
      </Link>

      <nav
        className='flex flex-wrap gap-4 md:flex-col'
        aria-label='メインメニュー'
      >
        <Link href='/' className='text-xl hover:text-purple-200'>
          Home
        </Link>

        <Link href='/courses' className='text-xl font-bold'>
          Courses
        </Link>

        {menus.map((menu) => (
          <span key={menu} className='text-xl text-white/80'>
            {menu}
          </span>
        ))}
      </nav>

      <div className='mt-10 text-xl md:mt-auto'>
        Settings
      </div>
    </aside>
  );
}
