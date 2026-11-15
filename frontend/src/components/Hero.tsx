import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='w-full bg-[#1D328C]'>
      <Link
        href='#feature'
        className='relative block aspect-video w-full lg:aspect-auto lg:h-[560px]'
        aria-label='Start Learning'
      >
        <Image
          src='/images/image.png'
          alt='Elephant Hero'
          fill
          sizes='100vw'
          priority
          className='object-contain lg:object-cover object-center'
        />
      </Link>
    </section>
  );
}