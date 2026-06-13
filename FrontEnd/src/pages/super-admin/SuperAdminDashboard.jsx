import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../services/authService';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'super_admin') {
      navigate('/');
      return;
    }
    setAdmin(user);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/sys_superadmin_ItechSkillsHubphpAccess2026_v2');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Super Admin Dashboard</h1>
      {admin && <p>Welcome, {admin.full_name}!</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SuperAdminDashboard;