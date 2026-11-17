import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

const features = [
  { title: 'Fun Lessons', image: '/images/book.png' },
  { title: 'Daily practice', image: '/images/dailypractice.png' },
  { title: 'Track Progress', image: '/images/progress.png' },
  { title: 'AI Conversation', image: '/images/aicanversation.png' },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className='min-h-screen bg-black text-white'>
        <Hero />

        <section id='feature' aria-label='学習機能' className='bg-white px-6 py-16'>
          <div className='mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'>
            {features.map((feature) => (
              <div key={feature.title} className='relative aspect-[5/4]'>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes='(min-width: 1200px) 270px, (min-width: 768px) 25vw, 50vw'
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
