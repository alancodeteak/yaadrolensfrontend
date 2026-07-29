import { Navigate, useParams } from 'react-router-dom';

/** Face enrollment lives on the employee details tab — keep old URLs working. */
const EmployeeTraining = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/employees/${id}`} replace state={{ tab: 'training' }} />;
};

export default EmployeeTraining;
