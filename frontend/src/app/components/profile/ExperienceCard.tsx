import { Experience } from "@/app/types/userTypes";

const ExperienceCard = ({
  company_name,
  position,
  start_date,
  end_date,
  description,
  employment_type,
}: Experience) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800">{position}</h3>
    <p className="text-gray-600">{company_name}</p>
    <p className="text-sm text-gray-500">
      {start_date} - {end_date}
    </p>
    {description && (
      <p className="mt-2 text-gray-700 text-sm leading-relaxed">
        {description}
      </p>
    )}
    <p className="text-sm text-gray-600">{employment_type}</p>
  </div>
);

export default ExperienceCard;
