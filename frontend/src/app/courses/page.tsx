import CourseCard from '@/components/CourseCard';
import Sidebar from '@/components/Sidebar';

const courses = [
  {
    id: 1,
    title: 'Daily English',
    description: '日常会話を学ぶ',
  },
  {
    id: 2,
    title: 'Travel English',
    description: '旅行で使う英語を学ぶ',
  },
  {
    id: 3,
    title: 'TOEIC',
    description: 'TOEIC対策を学ぶ',
  },
];

export default function CoursePage() {
  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
  <Sidebar />
    <main className="min-w-0 flex-1 bg-white px-6 py-10 text-black">
      <h1 className="text-3xl font-bold">
        Courses
      </h1>
      <p className="mt-4 text-gray-500">
        Choose a course to start learning English.
      </p>
    </main>
    </div>
  );
}
