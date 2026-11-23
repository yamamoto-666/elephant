'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Course, CourseLevel } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';
import CourseTabs from '@/components/CourseTabs';
import { apiUrl } from '@/lib/api';

type CourseResponse = {
  data: {
    id: number;
    title: string;
    description: string | null;
    difficulty: string;
    lessons_count: number;
  };
};

function toCourseLevel(difficulty: string): CourseLevel {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      throw new Error (`未対応の難易度です: ${difficulty}`);
  }
}

function CourseDetailContent() {
  const { id } = useParams<{ id: string }>();


const [course, setCourse] = useState<Course | null>(null);
const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');

useEffect(() => {
  const controller = new AbortController();

  async function loadCourse() {
    setLoadStatus('loading');
    setCourse(null);

    try {
      const response = await fetch(
        apiUrl(`/api/courses/${id}`),
        {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        },
      );

      if (controller.signal.aborted) return;

      if (response.status === 404) {
        setLoadStatus('not-found');
        return;
      }

      if (!response.ok) {
        throw new Error(
          `コースを取得できませんでした (HTTP ${response.status})`,
        );
      }

      const result: CourseResponse = await response.json();

      if (controller.signal.aborted) return;

      const data = result.data;

      setCourse({
        id: data.id,
          title: data.title,
          description: data.description ?? undefined,
          level: toCourseLevel(data.difficulty),
          lessonCount: data.lessons_count,
          image:
            data.title === 'Daily English'
              ? '/images/courses/daily_conversation.png'
              : undefined,
      });

      setLoadStatus('ready');
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('コース詳細取得エラー', error);
        setLoadStatus('error');
      }
    }
  }

  void loadCourse();
  return () => controller.abort();
}, [id]);

const progress = 30;

if (loadStatus !== 'ready') {
  return (
    <>
        <Link href='/courses' className='text-purple-600 hover:underline'>
          ← Back to Courses
        </Link>

        {loadStatus === 'loading' && (
          <p role="status" className="mt-8 text-sm text-gray-500">
            コースを読み込んでいます...
          </p>
        )}

        {loadStatus === 'not-found' && (
          <p className="mt-8 text-gray-600">
            Course not found.
          </p>
        )}

        {loadStatus === 'error' && (
          <p role="alert" className="mt-8 text-sm text-gray-700">
            コースを取得できませんでした。ページを再読み込みしてください。
          </p>
        )}
    </>
  );
}

  return (
    <>
      <Link href='/courses' className='text-purple-600 hover:underline'>
        ← Back to Courses
      </Link>

      {course ? (
        <>
          <section className='mt-8 rounded-xl bg-violet-50 p-6'>
            <div className='flex flex-col gap-6 sm:flex-row'>
              <div className='relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-gray-100'>
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={`${course.title}の画像`}
                    fill
                    sizes='144px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    📚
                  </div>
                )}
              </div>

              <div className='min-w-0 flex-1'>
                <h1 className='text-3xl font-bold'>{course.title}</h1>

                <p className='mt-2 text-gray-700'>
                  {course.description ??
                    'Start learning English with this course.'}
                </p>

                <p className='mt-2 text-gray-700'>
                  {course.level} / {course.lessonCount} Lessons
                </p>

                <div className='mt-4 flex items-center gap-4'>
                  <div className='h-3 flex-1 overflow-hidden rounded-full bg-gray-300'>
                    <div
                      className='h-full rounded-full bg-violet-600'
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className='font-semibold'>{progress}%</span>
                </div>
              </div>
            </div>
          </section>

          <CourseTabs
            key={course.id}
            courseId={course.id}
            description={course.description}
          />
        </>
      ) : (
        <p className='mt-8 text-gray-600'>Course not found.</p>
      )}
    </>
  );
}

export default function CourseDetailPage() {
  return (
    <SidebarLayout className='bg-white px-6 py-10 text-gray-900'>
      <Suspense
        fallback={
          <p role='status' className='text-sm text-gray-500'>
            コースを読み込んでいます…
          </p>
        }
      >
        <CourseDetailContent />
      </Suspense>
    </SidebarLayout>
  );
}