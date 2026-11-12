type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className='rounded-2xl bg-[#F3F6FF] p-6 text-center shadow-sm'>
      <span className='block text-5xl'>{icon}</span>
      <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
      <p className='mt-3 text-sm text-gray-500'>{description}</p>
    </div>
  );
}
