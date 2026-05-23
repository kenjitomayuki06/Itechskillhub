import { useState } from 'react';
import { Save, Bell, Globe, Palette, Shield, Database, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../services/authService';
import '../../styles/admin/AdminSettings.css';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ITechSkillsHub',
    siteEmail: 'admin@itechskillshub.edu',
    timezone: 'Asia/Manila',
    language: 'English',
    enableRegistration: true,
    requireEmailVerification: true,
    allowGuestBrowsing: false,
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChar: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving settings...');
    try {
      // TODO (backend): PUT /api/admin/settings
      // Body: full settings object (see state above)
      // Returns: { message: 'Settings saved successfully' }
      await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      toast.success('Settings saved successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Failed to save settings. Please try again.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general',       label: 'General',       icon: Globe     },
    { id: 'notifications', label: 'Notifications', icon: Bell      },
    { id: 'security',      label: 'Security',      icon: Shield    },
    { id: 'appearance',    label: 'Appearance',    icon: Palette   },
    { id: 'advanced',      label: 'Advanced',      icon: Database  },
  ];

  return (
    <div className="admin-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-text">
          <h1>Settings</h1>
          <p>Manage your platform configuration and preferences</p>
        </div>
        <button
          className="btn-save-settings"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="settings-content">

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <div className="section-title">
              <Globe size={24} />
              <div>
                <h2>General Settings</h2>
                <p>Basic platform configuration</p>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-item">
                <label>Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>

              <div className="setting-item">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => handleChange('siteEmail', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="setting-item">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">America/New York (GMT-5)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Default Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Filipino">Filipino</option>
                </select>
              </div>
            </div>

            <div className="settings-group">
              <h3>Registration Settings</h3>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Enable Registration</strong>
                  <span>Allow new users to register</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableRegistration}
                    onChange={() => handleToggle('enableRegistration')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Require Email Verification</strong>
                  <span>Users must verify email before access</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={() => handleToggle('requireEmailVerification')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Allow Guest Browsing</strong>
                  <span>Let visitors browse without login</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.allowGuestBrowsing}
                    onChange={() => handleToggle('allowGuestBrowsing')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-title">
              <Bell size={24} />
              <div>
                <h2>Notification Settings</h2>
                <p>Configure email and push notifications</p>
              </div>
            </div>

            <div className="settings-group">
              {[
                { key: 'emailNotifications', label: 'Email Notifications',  desc: 'Receive important updates via email'       },
                { key: 'pushNotifications',  label: 'Push Notifications',   desc: 'Browser push notifications'                },
                { key: 'weeklyReports',      label: 'Weekly Reports',       desc: 'Receive weekly analytics summary'          },
                { key: 'monthlyReports',     label: 'Monthly Reports',      desc: 'Comprehensive monthly insights'            },
              ].map(({ key, label, desc }) => (
                <div key={key} className="setting-toggle">
                  <div className="toggle-info">
                    <strong>{label}</strong>
                    <span>{desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={() => handleToggle(key)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-title">
              <Shield size={24} />
              <div>
                <h2>Security Settings</h2>
                <p>Protect your platform and user data</p>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Two-Factor Authentication</strong>
                  <span>Require 2FA for admin accounts</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle('twoFactorAuth')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>

              <div className="setting-item">
                <label>Minimum Password Length</label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
                  min="6"
                  max="32"
                />
              </div>

              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Require Special Characters</strong>
                  <span>Passwords must include special characters</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.requireSpecialChar}
                    onChange={() => handleToggle('requireSpecialChar')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <div className="section-title">
              <Palette size={24} />
              <div>
                <h2>Appearance Settings</h2>
                <p>Customize the look and feel</p>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-item">
                <label>Platform Logo</label>
                <div className="file-upload">
                  <button className="btn-upload">
                    <Upload size={18} />
                    Upload Logo
                  </button>
                  <span className="file-info">Recommended: 200x200px, PNG</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Primary Color</label>
                <div className="color-picker">
                  <input type="color" defaultValue="#5B4A9E" />
                  <span className="color-value">#5B4A9E</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Secondary Color</label>
                <div className="color-picker">
                  <input type="color" defaultValue="#7B6BBD" />
                  <span className="color-value">#7B6BBD</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced */}
        {activeTab === 'advanced' && (
          <div className="settings-section">
            <div className="section-title">
              <Database size={24} />
              <div>
                <h2>Advanced Settings</h2>
                <p>Technical configuration</p>
              </div>
            </div>

            <div className="settings-group">
              <div className="setting-toggle">
                <div className="toggle-info">
                  <strong>Maintenance Mode</strong>
                  <span>Temporarily disable public access</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="danger-zone">
                <h3>⚠️ Danger Zone</h3>
                <p>These actions are irreversible. Proceed with caution.</p>
                <button
                  className="btn-danger"
                  onClick={() => toast.error('Clear cache feature is not yet available in this version.')}
                >
                  Clear All Cache
                </button>
                <button
                  className="btn-danger"
                  onClick={() => toast.error('Reset settings feature is not yet available in this version.')}
                >
                  Reset All Settings
                </button>
                <button
                  className="btn-danger"
                  onClick={() => toast.error('Delete logs feature is not yet available in this version.')}
                >
                  Delete All Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}