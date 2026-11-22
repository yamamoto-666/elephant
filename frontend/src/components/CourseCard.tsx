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

    <article className='h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md'>
      <div className='relative aspect-video overflow-hidden bg-gradient bg-gradient-to-br from-blue-100 to-violet-100'>
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

      <div className='p-6'>
        <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {level}
        </span>

        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        <p className='mt-2 text-sm text-slate-500'>
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-violet-700 group-hover:text-violet-900">
          <span>View lessons</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </article>
    </Link>
  );
}
