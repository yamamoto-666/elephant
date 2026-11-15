import Link from 'next/link'
import Image from 'next/image';
import type { CourseLevel } from '@/types/course';

type CourseCardProps = {
  id: number;
  title: string;
  level: CourseLevel;
  lessonCount: number;
  image?: string;
};

export default function CourseCard({
  id,
  title,
  level,
  lessonCount,
  image,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className='block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
    >

    <article className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
      <div className='relative h-36 bg-gradient-to-r from-blue-100 to-purple-100'>
        {image ? (
          <Image
          src={image}
          alt={`${title}のコース画像`}
          fill
          sizes='(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'
          className='object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <span className='text-5xl' aria-hidden='true'>📚</span>
          </div>
        )}
      </div>

      <div className='p-4'>
        <h2 className='text-lg font-bold text-gray-900'>
          {title}
        </h2>

        <p className='mt-1 text-gray-600'>
          {level}
        </p>

        <p className='mt-1 text-gray-600'>
          {lessonCount} Lessons
        </p>
      </div>
    </article>
    </Link>
  );
}
