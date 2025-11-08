import { Experience } from "@/app/types/userTypes";

const ExperienceCard = ({
  company_name,
  position,
  start_date,
  end_date,
  description,
  employment_type,
}: Experience) => {
  const isCurrent = !end_date || new Date(end_date) > new Date();

 return (
   <div>
     <h3 className="text-lg font-normal text-gray-800">{position}</h3>
     <p className="text-gray-600">{company_name}</p>
     <p className="text-sm text-gray-500">
       {start_date} - {end_date ? end_date : 'present'}
     </p>
     {description && (
       <p className="mt-2 text-gray-700 text-sm leading-relaxed">
         {description}
       </p>
     )}
     <p className="text-sm text-gray-600">{employment_type}</p>

     {isCurrent && (
       <span className="inline-block text-xs font-medium bg-indigo-500 text-white rounded-full px-2 py-0.5 mt-2">
         Current
       </span>
     )}
   </div>
 );
};

export default ExperienceCard;
