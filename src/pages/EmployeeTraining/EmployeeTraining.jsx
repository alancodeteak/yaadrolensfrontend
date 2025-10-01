import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  useGetEmployeeByIdQuery, 
  useGetTrainingProgressQuery,
  useStartTrainingMutation,
  useAddTrainingPhotoMutation
} from '../../store/api';
import Card from '../../components/common/Card/Card';

const EmployeeTraining = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // API hooks
  const { data: employee, isLoading: employeeLoading } = useGetEmployeeByIdQuery(employeeId);
  const { data: trainingProgress, isLoading: progressLoading, refetch: refetchProgress } = useGetTrainingProgressQuery(employeeId);
  const [startTraining, { isLoading: isStarting }] = useStartTrainingMutation();
  const [addTrainingPhoto, { isLoading: isAddingPhoto }] = useAddTrainingPhotoMutation();

  // Start training session
  const handleStartTraining = async () => {
    try {
      await startTraining(employeeId).unwrap();
      toast.success('Training session started successfully!');
      refetchProgress();
    } catch (error) {
      console.error('Start training failed:', error);
      toast.error(error?.data?.message || 'Failed to start training session');
    }
  };

  // Open camera for photo capture
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  // Close camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhotos(prev => [...prev, imageData]);
    setIsCapturing(true);

    // Auto-close camera after capture
    setTimeout(() => {
      closeCamera();
      setIsCapturing(false);
    }, 1000);
  };

  // Upload captured photo
  const uploadPhoto = async (photoData) => {
    try {
      // Convert data URL to blob
      const response = await fetch(photoData);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('photo', blob, `training_photo_${Date.now()}.jpg`);

      const result = await addTrainingPhoto({ 
        employee_id: employeeId, 
        formData 
      }).unwrap();

      toast.success(`Photo uploaded successfully! Quality: ${(result.quality_score * 100).toFixed(1)}%`);
      setCapturedPhotos([]);
      refetchProgress();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error?.data?.message || 'Failed to upload photo');
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedPhotos([e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (employeeLoading || progressLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const progress = trainingProgress || {};
  const isTrainingActive = progress.training_status === 'in_progress';
  const photosCollected = progress.photos_collected || 0;
  const photosRequired = progress.photos_required || 15;
  const completionPercentage = progress.completion_percentage || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Face Recognition Training</h1>
            <p className="text-gray-600 mt-2">
              {employee?.first_name} {employee?.last_name}
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/employees/${employeeId}`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Progress */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Progress</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Photos Collected</span>
                  <span>{photosCollected} / {photosRequired}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{completionPercentage.toFixed(1)}% Complete</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className={`text-sm font-semibold ${
                    isTrainingActive ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {progress.training_status === 'in_progress' ? 'In Progress' : 
                     progress.training_status === 'completed' ? 'Completed' : 'Not Started'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Remaining</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {photosRequired - photosCollected} photos
                  </p>
                </div>
              </div>

              {progress.quality_scores && progress.quality_scores.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">Recent Quality Scores</p>
                  <div className="flex flex-wrap gap-2">
                    {progress.quality_scores.slice(-5).map((score, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          score >= 0.9 ? 'bg-green-100 text-green-800' :
                          score >= 0.7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {(score * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isTrainingActive && (
                <button
                  onClick={handleStartTraining}
                  disabled={isStarting}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isStarting ? 'Starting...' : 'Start Training Session'}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Photo Capture */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Training Photos</h2>
            
            {!isTrainingActive ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Training Not Started</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start a training session to begin adding photos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Camera Interface */}
                {isCameraOpen && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 bg-gray-900 rounded-lg"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Capture
                      </button>
                      <button
                        onClick={closeCamera}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Camera Controls */}
                {!isCameraOpen && (
                  <div className="space-y-3">
                    <button
                      onClick={openCamera}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Open Camera
                    </button>

                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Photo
                      </button>
                    </div>
                  </div>
                )}

                {/* Captured Photos Preview */}
                {capturedPhotos.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Captured Photo</h3>
                    <div className="relative">
                      <img
                        src={capturedPhotos[0]}
                        alt="Captured"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => uploadPhoto(capturedPhotos[0])}
                          disabled={isAddingPhoto}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                        >
                          {isAddingPhoto ? 'Uploading...' : 'Upload'}
                        </button>
                        <button
                          onClick={() => setCapturedPhotos([])}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Training Instructions */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Photo Quality Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Look directly at the camera</li>
                <li>• Remove glasses or hats if possible</li>
                <li>• Keep a neutral expression</li>
                <li>• Take photos from different angles</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Training Process</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Collect {photosRequired} high-quality photos</li>
                <li>• Photos are automatically validated</li>
                <li>• Aim for quality scores above 70%</li>
                <li>• Training completes when all photos are collected</li>
                <li>• You can retake photos if quality is low</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeTraining;

