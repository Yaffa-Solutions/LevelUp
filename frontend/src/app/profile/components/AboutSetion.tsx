'use client'

import EditButton from './EditButton'

type AboutProps = {
  about?: string;
};

const AboutSection = ({ about }: AboutProps) => {
  return (
    <div className="relative p-6  mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">About</h2>
        <EditButton onClick={() => alert('Edit about clicked')} />
      </div>
      <p className="text-gray-900 min-h-[48px]">
        {about || 'No bio added yet.'}
      </p>
    </div>
  );
}
export default AboutSection;