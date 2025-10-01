import React from 'react';
import Card from '../../../common/Card/Card';

const TrainingStatusCard = ({ employee }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Training Completed';
      case 'in_progress':
        return 'Training In Progress';
      default:
        return 'Training Not Started';
    }
  };

  return (
    <Card title="Training Status" className="mb-6">
      <div className="space-y-6">
        {/* Overall Training Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(employee.training_status)}
            <div>
              <p className="font-medium text-gray-900">{getStatusText(employee.training_status)}</p>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(employee.last_training_photo)}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            employee.training_status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : employee.training_status === 'in_progress'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {employee.training_status || 'Not Started'}
          </span>
        </div>

        {/* Training Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {employee.training_photos_count || 0}
            </div>
            <div className="text-sm text-blue-800">Training Photos</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {employee.training_quality_score ? `${(employee.training_quality_score * 100).toFixed(0)}%` : 'N/A'}
            </div>
            <div className="text-sm text-green-800">Quality Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        {employee.training_quality_score && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Training Quality</span>
              <span>{(employee.training_quality_score * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${employee.training_quality_score * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Training Photos Section */}
        {employee.embeddings && employee.embeddings.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Recent Training Photos ({employee.embeddings.length})
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {employee.embeddings.slice(0, 6).map((embedding) => (
                <div key={embedding.id} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                      {formatDate(embedding.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {employee.embeddings.length > 6 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                +{employee.embeddings.length - 6} more photos
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrainingStatusCard;
