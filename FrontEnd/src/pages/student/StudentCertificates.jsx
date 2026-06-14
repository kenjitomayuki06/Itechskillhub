import { useState, useEffect } from 'react';
import { Award, Download, Share2, Search, CheckCircle, Lock, Calendar } from 'lucide-react';
import { apiFetch } from '../../services/authService';
import '../../styles/pages/student/StudentCertificates.css';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(null);

  useEffect(() => {
    apiFetch('/api/certificates')
      .then(data => {
        setCertificates(data.certificates || data || []);
        setLoading(false);
      })
      .catch(() => {
        setCertificates([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="scert-page"><p style={{padding:'2rem'}}>Loading certificates...</p></div>;

  const filtered = certificates.filter(c =>
    (c.title || c.course_title || '').toLowerCase().includes(search.toLowerCase())
  );

  const previewCert = certificates.find(c => c.certificate_id === previewId);

  return (
    <div className="scert-page">
      <div className="scert-header">
        <div>
          <h1 className="scert-title">My Certificates</h1>
          <p className="scert-subtitle">View and download your earned certificates</p>
        </div>
      </div>

      <div className="scert-summary-row">
        <div className="scert-summary-card scert-summary-gold">
          <Award size={24} />
          <div>
            <div className="scert-summary-val">{certificates.length}</div>
            <div className="scert-summary-lbl">Certificates Earned</div>
          </div>
        </div>
      </div>

      <div className="scert-search-row">
        <div className="scert-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="scert-empty">
          <Lock size={40} />
          <h3>No certificates yet</h3>
          <p>Complete a course to earn your first certificate!</p>
        </div>
      ) : (
        <div className="scert-grid">
          {filtered.map(cert => (
            <div key={cert.certificate_id} className="scert-card scert-card-earned">
              <div className="scert-card-top" style={{ background: '#5B4A9E20' }}>
                <div className="scert-icon" style={{ color: '#5B4A9E' }}>🏆</div>
                <span className="scert-earned-badge"><CheckCircle size={12} /> Earned</span>
              </div>
              <div className="scert-card-body">
                <h3 className="scert-course-title">{cert.course_title || cert.title || 'Certificate'}</h3>
                <div className="scert-meta">
                  <span><Calendar size={12} /> {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                </div>
                <div className="scert-credential">ID: {cert.certificate_code || cert.certificate_id}</div>
              </div>
              <div className="scert-card-actions">
                <button className="scert-btn-preview" onClick={() => setPreviewId(cert.certificate_id)}>
                  <Award size={14} /> View
                </button>
                <button className="scert-btn-download">
                  <Download size={14} /> Download
                </button>
                <button className="scert-btn-share">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}