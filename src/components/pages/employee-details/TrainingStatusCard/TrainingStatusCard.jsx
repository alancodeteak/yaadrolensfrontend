import React from 'react';
import Card from '../../../common/Card/Card';

const TrainingStatusCard = ({ training }) => {
  const handleStartTraining = () => {
    console.log('Start Advanced Training clicked');
    // TODO: Implement start training functionality
  };

  return (
    <Card title="Training Status" className="mb-6">
      <div className="space-y-4">
        {/* Training Status Items */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-base text-gray-900">Basic enrollment complete</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-base text-gray-900">Advanced training pending</span>
          </div>
        </div>

        {/* Start Training Button */}
        <button
          onClick={handleStartTraining}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z" />
          </svg>
          <span>Start Advanced Training</span>
        </button>
      </div>
    </Card>
  );
};

export default TrainingStatusCard;
