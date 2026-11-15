export type CourseLevel = 
| 'Beginner'
| 'Intermediate'
| 'Advanced';

export type Course = {
  id: number;
  title: string;
  level: CourseLevel;
  lessonCount: number;
  image?: string;
  description?: string;
};


