import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const PatientCard = ({ 
  patient, 
  onClick,
  className,
  ...props 
}) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const hasUpcomingAppointment = patient.nextAppointment && new Date(patient.nextAppointment) > new Date();

  return (
    <Card 
      hover
      onClick={() => onClick && onClick(patient)}
      className={cn("p-6 cursor-pointer", className)}
      {...props}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
          {getInitials(patient.firstName, patient.lastName)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                Age {getAge(patient.dateOfBirth)} • ID: {patient.Id}
              </p>
            </div>
            
            {hasUpcomingAppointment && (
              <Badge variant="success">
                <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                Upcoming
              </Badge>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-400" />
              {patient.phone}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-400" />
              {patient.email}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Shield" className="w-4 h-4 mr-2 text-gray-400" />
              {patient.insuranceProvider}
            </div>
          </div>
          
{(() => {
            // Handle allergies field - can be array (mock data) or string (database MultilineText)
            let allergiesList = [];
            if (patient.allergies) {
              if (Array.isArray(patient.allergies)) {
                allergiesList = patient.allergies;
              } else if (typeof patient.allergies === 'string') {
                // Split by comma or newline for MultilineText format
                allergiesList = patient.allergies.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
              }
            }
            
            return allergiesList.length > 0 ? (
              <div className="mt-3">
                <div className="flex items-center text-sm text-warning">
                  <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
                  <span className="font-medium">Allergies:</span>
                  <span className="ml-1">{allergiesList.join(", ")}</span>
                </div>
              </div>
            ) : null;
          })()}
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
            <span>Last Visit: {formatDate(patient.lastVisit)}</span>
            {hasUpcomingAppointment && (
              <span>Next: {formatDate(patient.nextAppointment)}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;