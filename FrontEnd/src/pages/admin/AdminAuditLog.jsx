// src/pages/admin/AuditLog.jsx
import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/authService';

const AdminAuditLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiFetch('/api/admin/audit-logs').then(data => setLogs(data.logs));
  }, []);

  return (
    <div className="audit-log">
      <h2>Audit Log</h2>
      <table>
        <thead>
          <tr>
            <th>Admin</th><th>Action</th><th>Target</th>
            <th>Date</th><th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.admin_name}</td>
              <td><span className={`action-badge ${log.action_type}`}>{log.action_type}</span></td>
              <td>{log.target_description}</td>
              <td>{new Date(log.created_at).toLocaleDateString()}</td>
              <td>{new Date(log.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditLog;