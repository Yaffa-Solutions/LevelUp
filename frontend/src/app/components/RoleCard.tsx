import { RoleData } from '../../types'; 

const RoleCard: React.FC<RoleData> = ({ title, subtitle, description, iconKey, iconColor }) => {

    return (
        <div className="flex items-start p-6 border border-gray-200 rounded-xl shadow-lg w-full">
            <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: iconColor, color: 'white' }}>
                {/* <FontAwesomeIcon icon={Icon} className="text-xl" /> */}
            </div>
            <div>
                <h3 className="text-lg font-bold mb-1 text-gray-800">{title}</h3>
                <p className="text-sm font-medium text-purple-600 mb-2">{subtitle}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default RoleCard;