import Link from 'next/link';

export type LessonStatus = 'completed' | 'available' | 'locked';

export type Lesson = {
  id: number;
  title: string;
  status: LessonStatus;
};

type LessonItemsProps = {
  lesson: Lesson;
  number: number;
};

export default function LessonItems({ lesson, number }: LessonItemsProps) {
  return (
    <li className='flex flex-col gap-2 border-b border-gray-100 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-4'>
        <span className='w-20 shrink-0 font-semibold'>Lesson {number}</span>
        <span className='text-gray-700'>{lesson.title}</span>
      </div>

      {lesson.status === 'available' ? (
        <Link
          href={`/lessons/${lesson.id}/quiz`}
          className='inline-flex w-fit items-center justify-center rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700'
        >
          Start →
        </Link>
      ) : lesson.status === 'completed' ? (
        <span className='text-sm font-semibold text-green-700'>✅Completed</span>
      ) : (
        <span className='text-sm font-semibold text-gray-500'>🔒Locked</span>
      )}
    </li>
  );
}
