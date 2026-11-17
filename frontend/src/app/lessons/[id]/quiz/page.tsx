'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

type LessonQuestionsResponse = {
  data: {
    id: number;
    question_text: string;
    question_type: string;
    question_number: number;
    answers: {
      id: number;
      answer_text: string;
    }[];
  }[];
};

function LessonQuizContent({ id }: { id: string }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [answerError, setAnswerError] = useState('');

  const [apiQuestions, setApiQuestions] = useState<LessonQuestionsResponse['data']>([]);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'notFound' | 'error'>(
    'loading',
  );

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/lessons/${id}/questions`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          setLoadStatus('notFound');
          return;
        }

        if (!response.ok) {
          throw new Error(`問題の取得に失敗しました。（HTTP ${response.status})`);
        }

        const result: LessonQuestionsResponse = await response.json();
        setApiQuestions(result.data);
        setLoadStatus('ready');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('クイズの問題を取得に失敗しました', error);
          setLoadStatus('error');
        }
      }
    }

    void loadQuestions();
    return () => controller.abort();
  }, [id, retryCount]);

  const currentQuestionNumber = currentQuestionIndex + 1;
  const totalQuestions = apiQuestions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const progress = Math.round((currentQuestionNumber / totalQuestions) * 100);

  if (loadStatus === 'loading') {
    return <p className='p-6'>問題を読み込んでいます...</p>;
  }
  if (loadStatus === 'notFound') {
    return (
      <div className='p-6'>
        <h1 className='text-xl font-semibold'>このレッスンが見つかりません</h1>
        <Link href='/courses' className='mt-4 inline-block text-violet-700 underline'>
          コース一覧に戻る
        </Link>
      </div>
    );
  }

  if (loadStatus === 'error') {
    return (
      <div className='p-6'>
        <p role='alert'>問題を取得できませんでした</p>
        <button
          type='button'
          onClick={() => {
            setLoadStatus('loading');
            setRetryCount((count) => count + 1);
          }}
          className='mt-4 rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
        >
          もう一度読み込む
        </button>
      </div>
    );
  }

  const apiQuestion = apiQuestions[currentQuestionIndex];

  if (!apiQuestion) {
    return <p className='p-6'>このレッスンにはまだ問題がありません。</p>;
  }
  async function checkAnswer() {
    if (selectedAnswerId === null || isChecking || isSubmitted) return;

    setIsChecking(true);
    setAnswerError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/questions/${apiQuestion.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ answer_id: selectedAnswerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: { is_correct: boolean } = await response.json();

      setIsCorrect(result.is_correct);
      if (result.is_correct) {
        setCorrectCount((count) => count + 1);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('回答の送信に失敗しました', error);
      setAnswerError('回答を送信できませんでした。もう一度お試しください。');
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className='mx-auto max-w-3xl'>
      <Link
        href='/courses'
        className='inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-violet-600'
      >
        ← Back to Courses
      </Link>

      <section className='mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10'>
        {/* ヘッダー */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest text-violet-600'>
              Elephant · English Quiz
            </p>

            <h1 className='mt-2 text-2xl font-bold tracking-tight'>
              Question {currentQuestionNumber}
              <span className='text-slate-400'> / {totalQuestions}</span>
            </h1>
          </div>

          <span className='rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700'>
            {progress}%
          </span>
        </div>

        {/* 進捗バー */}
        <div
          role='progressbar'
          aria-label='Quiz progress'
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className='mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200'
        >
          <div
            className='h-full rounded-full bg-violet-600 transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 問題文 */}
        <div className='mt-12 text-center'>
          <p className='text-xs font-semibold uppercase tracking-widest text-slate-400'>
            Choose the correct answer
          </p>

          <h2 className='mt-4 text-2xl font-bold tracking-tight sm:text-3xl'>
            {apiQuestion.question_text}
          </h2>
        </div>

        {/* 選択肢 */}
        <div className='mx-auto mt-10 max-w-xl space-y-3'>
          {apiQuestion.answers.map((option, index) => (
            <button
              key={option.id}
              type='button'
              disabled={isSubmitted || isChecking}
              onClick={() => setSelectedAnswerId(option.id)}
              aria-pressed={selectedAnswerId === option.id}
              className={`flex min-h-20 w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-default ${
                selectedAnswerId === option.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  selectedAnswerId === option.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span className='flex-1 text-base font-semibold text-slate-800'>
                {option.answer_text}
              </span>

              {selectedAnswerId === option.id && (
                <span aria-hidden='true' className='font-bold text-violet-600'>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 回答結果・ボタン */}
        <div className='mx-auto mt-8 max-w-xl'>
          {isSubmitted && (
            <p
              aria-live='polite'
              className={`mb-5 rounded-xl px-5 py-4 text-sm font-semibold ${
                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {isCorrect ? 'Correct! Great job!' : 'Incorrect. Keep practicing!'}
            </p>
          )}

          {answerError && (
            <p role='alert' className='mb-4 text-sm text-red-700'>
              {answerError}
            </p>
          )}

          <button
            type='button'
            disabled={selectedAnswerId === null || isSubmitted || isChecking}
            onClick={checkAnswer}
            className='w-full rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isChecking ? 'Checking...' : 'Check Answer →'}
          </button>
          {isSubmitted && currentQuestionIndex < totalQuestions - 1 && (
            <button
              type='button'
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswerId(null);
                setIsSubmitted(false);
              }}
              className='mt-4 w-full rounded-xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 hover:bg-violet-50'
            >
              Next Question →
            </button>
          )}

          {isSubmitted && currentQuestionIndex === totalQuestions - 1 && (
            <div className='mt-4 text-center'>
              <p className='mt-4 text-center font-semibold text-violet-700'>
                All questions answered! Score: {correctCount} / {totalQuestions} ({accuracy}%)
              </p>

              <button
                type='button'
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswerId(null);
                  setIsSubmitted(false);
                  setCorrectCount(0);
                }}
                className='mt-4 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700'
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Suspenseでクイズ画面を囲む
function LessonQuizRoute() {
  const { id } = useParams<{ id: string }>();
  return <LessonQuizContent key={id} id={id} />;
}

export default function LessonQuizPage() {
  return (
    <SidebarLayout className='bg-slate-50 px-4 py-8 text-slate-900 sm:px-8'>
      <Suspense fallback={<p className='p-6 text-gray-500'>Loading quiz...</p>}>
        <LessonQuizRoute />
      </Suspense>
    </SidebarLayout>
  );
}
