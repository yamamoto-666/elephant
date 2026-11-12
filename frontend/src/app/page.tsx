import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';

const features = [
  {
    id: 1,
    icon: '📖',
    title: 'Fun Lesson',
    description: '楽しく英語を学ぶ',
  },
  {
    id: 2,
    icon: '🗓️',
    title: 'Daily Practice',
    description: '毎日の学習を練習を身につける',
  },
  {
    id: 3,
    icon: '📊',
    title: 'Track Progress',
    description: '自分の成長を確認する',
  },
  {
    id: 4,
    icon: '🤖',
    title: 'AI Conversation',
    description: 'AIと英会話を練習する',
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className='min-h-screen bg-black text-white'>
        <Hero />

        <section id='feature' className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
