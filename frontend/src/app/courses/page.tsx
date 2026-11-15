'use client';

import { courses } from '@/data/courses';
import { useState } from 'react';
import type { CourseLevel } from '@/types/course';
import CourseCard from '@/components/CourseCard';
import Sidebar from '@/components/Sidebar';


const levels: (CourseLevel | 'All')[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
];

export default function CoursePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] =
  useState<CourseLevel | 'All'>('All');
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesLevel =
      selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
      <Sidebar />
      <main className='min-w-0 flex-1 bg-white px-6 py-10 text-black'>
        <h1 className='text-3xl font-bold'>Courses</h1>
        <p className='mt-4 text-gray-500'>Choose a course to start learning English.</p>

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

        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="難易度フィルター">
          {levels.map((level) => (
            <button
              key={level}
              type='button'
              onClick={() => setSelectedLevel(level)}
              aria-pressed={selectedLevel === level}
              className={`rounded-lg border px-5 py-2 text-sm font-semibold transition-colors ${
                selectedLevel === level
                  ? `border-[#6645F5] bg-[#6645F5] text-white`
                  : `border-gray-300 bg-white text-gray-700 hover:border-[#6645F5]`
              }`}
            >
              {level}
            </button>
          ))}
        </div>

          {filteredCourses.length === 0 ? (
            <p className='mt-6 text-sm text-gray-500'>
              No courses found.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      </main>
    </div>
  );
}
