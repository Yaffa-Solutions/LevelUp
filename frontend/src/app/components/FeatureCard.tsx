import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faMapMarkerAlt, faBriefcase, faUsers, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FeatureData } from '../../types'; 

const iconMap: Record<FeatureData['iconKey'], IconDefinition> = {
    evaluation: faChartBar,
    roadmap: faMapMarkerAlt,
    matching: faBriefcase,
    community: faUsers,
};

const FeatureCard: React.FC<FeatureData> = ({ title, description, iconKey, color }) => {
  const Icon = iconMap[iconKey];

  return (
    <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 h-full">
      <div className={`p-4 rounded-xl mb-4`} style={{ backgroundColor: color, color: 'white' }}>
        <FontAwesomeIcon icon={Icon} className="text-3xl" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;