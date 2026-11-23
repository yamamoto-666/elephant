'use client';

import { useEffect, useState } from 'react';
import LessonItem from '@/components/LessonItem';
import { apiUrl } from '@/lib/api';

type CourseTabsProps = {
  courseId: number;
  description?: string;
};

type ApiLesson = {
  id: number;
  title: string;
  order_number: number;
};

type ApiUnit = {
  id: number;
  title: string;
  order_number: number;
  lessons: ApiLesson[];
};

type UnitsResponse = {
  data: ApiUnit[];
};

export default function CourseTabs({
  courseId,
  description,
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<'Units' | 'About'>('Units');

  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);

  const [units, setUnits] = useState<ApiUnit[]>([]);

  const [loadStatus, setLoadStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');

  const [retryCount, setRetryCount] = useState(0);

  // コースのユニットとレッスンを取得する
  useEffect(() => {
    const controller = new AbortController();

    async function loadUnits() {
      try {
        const response = await fetch(
          apiUrl(`/api/courses/${courseId}/units`),
          {
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `ユニットを取得できませんでした（HTTP ${response.status}）`,
          );
        }

        const result: UnitsResponse = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        setUnits(result.data);
        setExpandedUnitId(result.data[0]?.id ?? null);
        setLoadStatus('ready');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('ユニット取得エラー', error);
          setLoadStatus('error');
        }
      }
    }

    void loadUnits();

    return () => controller.abort();
  }, [courseId, retryCount]);

  return (
    <section className='mt-6'>
      {/* Units / About の切り替え */}
      <div
        role='group'
        aria-label='Course details sections'
        className='flex gap-8 border-b border-gray-300'
      >
        <button
          type='button'
          onClick={() => setActiveTab('Units')}
          aria-pressed={activeTab === 'Units'}
          className={`border-b-4 px-4 pb-2 font-semibold ${
            activeTab === 'Units'
              ? 'border-violet-600 text-gray-900'
              : 'border-transparent text-gray-500'
          }`}
        >
          Units
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('About')}
          aria-pressed={activeTab === 'About'}
          className={`border-b-4 px-4 pb-2 font-semibold ${
            activeTab === 'About'
              ? 'border-violet-600 text-gray-900'
              : 'border-transparent text-gray-500'
          }`}
        >
          About
        </button>
      </div>

      {activeTab === 'Units' ? (
        <div className='mt-6 space-y-3'>
          {/* 読み込み中 */}
          {loadStatus === 'loading' && (
            <p role='status' className='py-4 text-sm text-slate-500'>
              ユニットを読み込んでいます…
            </p>
          )}

          {/* 取得失敗・再取得ボタン */}
          {loadStatus === 'error' && (
            <div className='rounded-lg bg-red-50 p-4'>
              <p role='alert' className='text-sm text-red-700'>
                ユニットを取得できませんでした。
              </p>

              <button
                type='button'
                onClick={() => {
                  setLoadStatus('loading');
                  setRetryCount((count) => count + 1);
                }}
                className='mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
              >
                もう一度読み込む
              </button>
            </div>
          )}

          {/* 取得成功・ユニットが0件 */}
          {loadStatus === 'ready' && units.length === 0 && (
            <p className='py-4 text-sm text-slate-500'>
              このコースにはまだユニットがありません。
            </p>
          )}

          {/* 取得成功・ユニット一覧 */}
          {loadStatus === 'ready' &&
            units.map((unit) => (
              <section
                key={unit.id}
                className='overflow-hidden rounded-lg border border-violet-100'
              >
                {/* ユニットの開閉ボタン */}
                <button
                  type='button'
                  onClick={() =>
                    setExpandedUnitId((currentId) =>
                      currentId === unit.id ? null : unit.id,
                    )
                  }
                  aria-expanded={expandedUnitId === unit.id}
                  className='flex w-full items-center justify-between bg-violet-50 px-5 py-4 text-left'
                >
                  <span className='font-semibold'>
                    Unit {unit.order_number} — {unit.title}
                  </span>

                  <span aria-hidden='true'>
                    {expandedUnitId === unit.id ? '−' : '+'}
                  </span>
                </button>

                {/* 開いているユニットのレッスン一覧 */}
                {expandedUnitId === unit.id && (
                  <ul className='space-y-2 bg-white px-5 py-4'>
                    {unit.lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        number={lesson.order_number}
                        lesson={{
                          id: lesson.id,
                          title: lesson.title,
                          status: 'available',
                        }}
                      />
                    ))}
                  </ul>
                )}
              </section>
            ))}
        </div>
      ) : (
        /* About の内容 */
        <div className='mt-6 rounded-lg bg-violet-50 p-6'>
          <h2 className='text-xl font-bold'>About this Course</h2>

          <p className='mt-3 text-gray-700'>
            {description ?? 'Course description is not available.'}
          </p>
        </div>
      )}
    </section>
  );
}