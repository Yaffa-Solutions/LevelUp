import EditButton from './EditButton';

type ProfileInfoProps = {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  levelName?: string;
}

const ProfileInfo = ({ firstName, lastName, jobTitle, levelName}: ProfileInfoProps) => {
  return (
    <div className="relative flex flex-col items-start mt-1 ml-5 ">
      <h2 className="mt-3 text-2xl font-medium text-gray-950">
        {firstName || 'No first name'} {lastName || 'No last name'}
      </h2>
      <p className="text-gray-900">{jobTitle || 'No job title yet'}</p>
      <p className="text-gray-900">{levelName || 'No have level yet'}</p>


      <EditButton onClick={() => alert('You clicked the edit button')} className=''/>
    </div>
  );
};

export default ProfileInfo;
