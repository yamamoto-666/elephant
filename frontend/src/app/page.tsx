export default function Home(){
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="text-5xl font-bold">
            Elephant
          </h1>

          <p className="mt-6 text-xl text-gray-300">
            英語学習を毎日の習慣に。
          </p>

          <p className="mt-3 text-gray-400">
            Learn English step by step.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-900 p-6">
              <h2 className="text-xl font-semibold">
                Daily English
              </h2>
              <p className="mt-2 text-gray-400">
                日常英会話を学ぶ
              </p>
            </div>

            <div className="rounded-xl bg-gray-900 p-6">
              <h2 className="text-xl font-semiold">
                Travel English
              </h2>
              <p className="mt-2 text-gray-400">
                旅行で使う英語を学ぶ
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-6">
              <h2 className="text-xl font-semibold">
                TOEIC
              </h2>
              <p className="mt-2 text-gray-400">
                TOEIC対策を始める
              </p>
            </div>
          </div>
        </div>
      </main>
    );
}