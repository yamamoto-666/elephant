type CourseCardProps = {
  title: string;
  description: string;
};

export default function CourseCard({
  title,
  description,
}: CourseCardProps) {
  return (
    <div className="rounded-xl bg-gray-900">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-gray-400">
        {description}
      </p>
    </div>
  );
}