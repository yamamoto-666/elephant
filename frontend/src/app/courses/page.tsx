'use client';

import { useEffect, useState } from 'react';
import type { Course, CourseLevel } from '@/types/course';
import CourseCard from '@/components/CourseCard';
import SidebarLayout from '@/components/SidebarLayout';
import { apiUrl } from '@/lib/api';

type ApiCourse = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
  lessons_count: number;
};

type CourseResponse = {
  data: ApiCourse[];
};

const levels: (CourseLevel | 'All')[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
];

// APIの難易度を画面用の値に変換する
function toCourseLevel(difficulty: string): CourseLevel {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      throw new Error(`未対応の難易度です: ${difficulty}`);
  }
}

export default function CoursePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedLevel, setSelectedLevel] =
    useState<CourseLevel | 'All'>('All');

  const [courses, setCourses] = useState<Course[]>([]);

  const [loadStatus, setLoadStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch(
          apiUrl('/api/courses'),
          {
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `コースを取得できませんでした（HTTP ${response.status}）`,
          );
        }

        const result: CourseResponse = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        // APIのデータを既存の画面用の型に変換する
        const loadedCourses: Course[] = result.data.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description ?? undefined,
          level: toCourseLevel(course.difficulty),
          lessonCount: course.lessons_count,
          image:
            course.title === 'Daily English'
            ? '/images/courses/daily_conversation.png'
            : undefined,
        }));

        setCourses(loadedCourses);
        setLoadStatus('ready');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('コース取得エラー', error);
          setLoadStatus('error');
        }
      }
    }

    void loadCourses();

    return () => controller.abort();
  }, [retryCount]);

  // 取得したコースを検索条件で絞り込む
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesLevel =
      selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <SidebarLayout className='bg-white px-6 py-10 text-black'>
      <h1 className='text-3xl font-bold'>Courses</h1>

      <p className='mt-4 text-gray-500'>
        Choose a course to start learning English.
      </p>

      {/* コース名の検索 */}
      <div className='mt-8 max-w-xl'>
        <label htmlFor='course-search' className='sr-only'>
          コースを検索
        </label>

        <input
          type='search'
          id='course-search'
          placeholder='Search courses...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500'
        />
      </div>

      {/* 難易度フィルター */}
      <div
        className='mt-6 flex flex-wrap gap-3'
        role='group'
        aria-label='難易度フィルター'
      >
        {levels.map((level) => (
          <button
            key={level}
            type='button'
            onClick={() => setSelectedLevel(level)}
            aria-pressed={selectedLevel === level}
            className={`rounded-lg border px-5 py-2 text-sm font-semibold transition-colors ${
              selectedLevel === level
                ? 'border-[#6645F5] bg-[#6645F5] text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#6645F5]'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* 読み込み中 */}
      {loadStatus === 'loading' && (
        <p role='status' className='mt-6 text-sm text-gray-500'>
          コースを読み込んでいます…
        </p>
      )}

      {/* 取得失敗 */}
      {loadStatus === 'error' && (
        <div className='mt-6 rounded-lg bg-red-50 p-4'>
          <p role='alert' className='text-sm text-red-700'>
            コースを取得できませんでした。
          </p>

          <button
            type='button'
            onClick={() => {
              setLoadStatus('loading');
              setRetryCount((count) => count + 1);
            }}
            className='mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
          >
            もう一度読み込む
          </button>
        </div>
      )}

      {/* 取得成功 */}
      {loadStatus === 'ready' && (
        <>
          {courses.length === 0 ? (
            <p className='mt-6 text-sm text-gray-500'>
              コースはまだ登録されていません。
            </p>
          ) : filteredCourses.length === 0 ? (
            <p className='mt-6 text-sm text-gray-500'>
              条件に一致するコースがありません。
            </p>
          ) : (
            <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  level={course.level}
                  lessonCount={course.lessonCount}
                  image={course.image}
                />
              ))}
            </div>
          )}
        </>
      )}
    </SidebarLayout>
  );
}