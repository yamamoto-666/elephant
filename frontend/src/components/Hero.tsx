export default function Hero() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-r from-[#1D328C] via-[#453CC5] to-[#8161F5] text-white'>
      <div className='mx-auto grid min-h-[400px] max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2'>
        <div className="text-center md:text-left">
          <h1 className='text-4xl font-bold leading-tight md:text-5xl'>
            Learn English
            <br />
            for a Brighter Future
          </h1>

          <p className='mt-6 text-lg text-purple-100'>
            Fun and Effective English Learning
            <br />
            Anytime, Anywhere
          </p>

          <a
            href='#feature'
            className='mt-8 inline-block rounded-full bg-purple-400 px-10 py-4 font-semibold transition hover:bg-purple-300'
          >
            Start Learning →
          </a>
        </div>

        <div className='hidden items-center justify-center md:flex'>
          <div className='flex h-72 w-72 items-center justify-center rounded-full bg-white/15'>
            <span className='text-8xl'>📚</span>
          </div>
        </div>
      </div>
    </section>
  );
}
