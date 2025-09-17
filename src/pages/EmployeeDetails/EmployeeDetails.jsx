import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader, TabNavigation, PersonalDetailsCard, JobInformationCard, TrainingStatusCard, TrainingSessionsTable, PasswordUpdate, NotificationPreferences, AttendanceLog } from '../../components/pages/employee-details';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');

  // Mock employee data - in real app, this would come from API
  const employee = {
    id: 'EMP001',
    name: 'Sophia Clark',
    email: 'sophia.clark@acmeco.com',
    phone: '+1 (555) 123-4567',
    address: '123 Maple Street, Anytown, USA 12345',
    dob: '1990-05-15',
    department: 'Marketing',
    position: 'Marketing Specialist',
    hireDate: '2023-07-01',
    manager: 'Mike Johnson',
    status: 'Active',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    training: {
      basicComplete: true,
      advancedPending: true,
      sessions: [
        { name: 'Safety Training', status: 'Completed', date: '2023-08-15' },
        { name: 'Compliance Training', status: 'Completed', date: '2023-09-20' },
        { name: 'New Hire Orientation', status: 'Completed', date: '2023-07-01' }
      ]
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonalDetailsCard employee={employee} />
            <JobInformationCard employee={employee} />
          </div>
        );
      
      case 'attendance':
        return <AttendanceLog />;
      
      case 'training':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrainingStatusCard training={employee.training} />
            <TrainingSessionsTable trainingSessions={employee.training.sessions} />
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <PasswordUpdate />
            <NotificationPreferences />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader employee={employee} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
