import { Wrench } from 'lucide-react';
import '../styles/MaintenancePage.css';

export default function MaintenancePage() {
  return (
    <div className="mp-page">
      <div className="mp-card">
        <div className="mp-icon">
          <Wrench size={48} />
        </div>
        <h1 className="mp-title">We'll be right back!</h1>
        <p className="mp-message">
          ITechSkillsHub is currently undergoing scheduled maintenance.
          We're working hard to improve your experience and will be back online shortly.
        </p>
        <p className="mp-subtext">
          Thank you for your patience. Please check back again soon.
        </p>
      </div>
    </div>
  );
}