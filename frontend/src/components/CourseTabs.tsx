
'use client';

import { useState } from 'react';

type CourseTabsProps = {
  description?: string;
};

type LessonStatus = 'completed' | 'available' | 'locked';

type Lesson = {
  id: number;
  title: string;
  status: LessonStatus;
};

type Unit = {
  id: number;
  title: string;
  lessons: Lesson[];
};

// デザイン確認用の仮データ
const sampleUnits: Unit[] = [
  {
    id: 1,
    title: 'Self Introduction',
    lessons: [
      { id: 1, title: 'Basic Greetings', status: 'completed' },
      { id: 2, title: 'Talking About Yourself', status: 'available' },
      { id: 3, title: 'Hobbies and Interests', status: 'locked' },
    ],
  },
  {
    id: 2,
    title: 'At the Restaurant',
    lessons: [
      { id: 4, title: 'Ordering Food', status: 'locked' },
      { id: 5, title: 'Asking for the Bill', status: 'locked' },
    ],
  },
  {
    id: 3,
    title: 'Shopping',
    lessons: [
      { id: 6, title: 'Asking Prices', status: 'locked' },
      { id: 7, title: 'Buying Clothes', status: 'locked' },
    ],
  },
];

export default function CourseTabs({ description }: CourseTabsProps) {
  const [activeTab, setActiveTab] =
    useState<'Units' | 'About'>('Units');

  const [expandedUnitId, setExpandedUnitId] =
    useState<number | null>(1);

  return (
    <section className='mt-6'>
      {/* Units / About タブ */}
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

      {/* タブに応じて表示を切り替える */}
      {activeTab === 'Units' ? (
        <div className='mt-6 space-y-3'>
          {sampleUnits.map((unit) => (
            <section
              key={unit.id}
              className='overflow-hidden rounded-lg border border-violet-100'
            >
              {/* Unitの開閉ボタン */}
              <button
                type='button'
                onClick={() =>
                  setExpandedUnitId(
                    expandedUnitId === unit.id ? null : unit.id
                  )
                }
                aria-expanded={expandedUnitId === unit.id}
                className='flex w-full items-center justify-between bg-violet-50 px-5 py-4 text-left'
              >
                <span className='font-semibold'>
                  Unit {unit.id} — {unit.title}
                </span>

                <span aria-hidden='true'>
                  {expandedUnitId === unit.id ? '−' : '+'}
                </span>
              </button>

              {/* 開いているUnitのLessonを表示 */}
              {expandedUnitId === unit.id && (
                <ul className='space-y-2 bg-white px-5 py-4'>
                  {unit.lessons.map((lesson, index) => (
                    <li
                      key={lesson.id}
                      className='flex flex-col gap-2 border-b border-gray-100 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between'
                    >
                      <div className='flex items-center gap-4'>
                        <span className='w-20 shrink-0 font-semibold'>
                          Lesson {index + 1}
                        </span>

                        <span className='text-gray-700'>
                          {lesson.title}
                        </span>
                      </div>

                      {/* Lessonの学習状態 */}
                      {lesson.status === 'completed' ? (
                        <span className='text-sm font-semibold text-green-700'>
                          ✅ Completed
                        </span>
                      ) : lesson.status === 'available' ? (
                        <span className='text-sm font-semibold text-violet-700'>
                          ▶ Available
                        </span>
                      ) : (
                        <span className='text-sm font-semibold text-gray-500'>
                          🔒 Locked
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      ) : (
        /* Aboutタブの内容 */
        <div className='mt-6 rounded-lg bg-violet-50 p-6'>
          <h2 className='text-xl font-bold'>
            About this Course
          </h2>

          <p className='mt-3 text-gray-700'>
            {description ?? 'Course description is not available.'}
          </p>
        </div>
      )}
    </section>
  );
}
