
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';
import CourseTabs from '@/components/CourseTabs';
import { courses } from '@/data/courses';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();

  // URLのIDに一致するコースを探す
  const course = courses.find(
    (course) => course.id === Number(id)
  );

  // デザイン確認用の仮の進捗率
  const progress = 30;

  return (
      <SidebarLayout className='bg-white px-6 py-10 text-gray-900'>
        <Link
          href='/courses'
          className='text-purple-600 hover:underline'
        >
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
                  <h1 className='text-3xl font-bold'>
                    {course.title}
                  </h1>

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

                    <span className='font-semibold'>
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <CourseTabs
              key={course.id}
              description={course.description}
            />
          </>
        ) : (
          <p className='mt-8 text-gray-600'>
            Course not found.
          </p>
        )}
      </SidebarLayout>
  );
}
