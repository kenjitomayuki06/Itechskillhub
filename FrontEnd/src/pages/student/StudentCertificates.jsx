import { useState } from 'react';
import { Award, Download, Share2, Search, CheckCircle, Lock, Calendar } from 'lucide-react';
import '../../styles/pages/student/StudentCertificates.css';

/* ── Mock data — replace with real API calls when backend is ready ── */
const MOCK_CERTIFICATES = [
  {
    id: 1,
    title: 'PC Hardware Assembly & Troubleshooting',
    category: 'TESDA',
    icon: '⚙️',
    color: '#10b981',
    issuedDate: 'May 10, 2026',
    credentialId: 'ITCH-2026-PC-001',
    status: 'earned',
    grade: 'A',
    score: 94,
  },
];

const MOCK_IN_PROGRESS = [
  {
    id: 2,
    title: 'CSS NC II — Computer Systems Servicing',
    icon: '🖥️',
    color: '#5B4A9E',
    progress: 60,
    remaining: 2,
  },
  {
    id: 3,
    title: 'Network Systems Cabling (NSC)',
    icon: '🔌',
    color: '#3b82f6',
    progress: 25,
    remaining: 3,
  },
  {
    id: 4,
    title: 'OS Installation & Configuration (OSIC)',
    icon: '💿',
    color: '#f59e0b',
    progress: 0,
    remaining: 5,
  },
];

export default function StudentCertificates() {
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(null);

  const filtered = MOCK_CERTIFICATES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const previewCert = MOCK_CERTIFICATES.find((c) => c.id === previewId);

  return (
    <div className="scert-page">

      {/* ── Header ── */}
      <div className="scert-header">
        <div>
          <h1 className="scert-title">My Certificates</h1>
          <p className="scert-subtitle">View and download your earned certificates</p>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="scert-summary-row">
        <div className="scert-summary-card scert-summary-gold">
          <Award size={24} />
          <div>
            <div className="scert-summary-val">{MOCK_CERTIFICATES.length}</div>
            <div className="scert-summary-lbl">Certificates Earned</div>
          </div>
        </div>
        <div className="scert-summary-card scert-summary-blue">
          <CheckCircle size={24} />
          <div>
            <div className="scert-summary-val">
              {MOCK_CERTIFICATES.filter((c) => c.status === 'earned').length}
            </div>
            <div className="scert-summary-lbl">Completed Courses</div>
          </div>
        </div>
        <div className="scert-summary-card scert-summary-gray">
          <Lock size={24} />
          <div>
            <div className="scert-summary-val">{MOCK_IN_PROGRESS.length}</div>
            <div className="scert-summary-lbl">In Progress</div>
          </div>
        </div>
      </div>

      {/* ── Earned Certificates ── */}
      <section className="scert-section">
        <h2 className="scert-section-title">
          <Award size={16} /> Earned Certificates
        </h2>

        {/* Search */}
        <div className="scert-search">
          <Search size={14} className="scert-search-icon" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="scert-search-input"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="scert-empty">
            <Award size={40} />
            <p>No certificates found.</p>
            <span>Complete a course to earn your first certificate!</span>
          </div>
        ) : (
          <div className="scert-grid">
            {filtered.map((cert) => (
              <div key={cert.id} className="scert-card">
                {/* Card Top */}
                <div className="scert-card-top" style={{ background: cert.color + '18' }}>
                  <div className="scert-card-emblem" style={{ borderColor: cert.color }}>
                    <span className="scert-card-icon">{cert.icon}</span>
                    <Award size={18} className="scert-award-icon" style={{ color: cert.color }} />
                  </div>
                  <div className="scert-card-grade" style={{ background: cert.color }}>
                    {cert.grade}
                  </div>
                </div>

                {/* Card Body */}
                <div className="scert-card-body">
                  <span className="scert-card-category">{cert.category}</span>
                  <h3 className="scert-card-title">{cert.title}</h3>
                  <div className="scert-card-meta">
                    <span><Calendar size={11} /> {cert.issuedDate}</span>
                    <span>Score: <strong style={{ color: cert.color }}>{cert.score}%</strong></span>
                  </div>
                  <div className="scert-card-id">ID: {cert.credentialId}</div>
                </div>

                {/* Card Actions */}
                <div className="scert-card-actions">
                  <button
                    className="scert-preview-btn"
                    onClick={() => setPreviewId(cert.id)}
                  >
                    View
                  </button>
                  <button className="scert-action-btn" title="Download">
                    <Download size={14} />
                  </button>
                  <button className="scert-action-btn" title="Share">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── In Progress ── */}
      <section className="scert-section">
        <h2 className="scert-section-title">
          <Lock size={16} /> Certificates to Unlock
        </h2>
        <div className="scert-locked-list">
          {MOCK_IN_PROGRESS.map((c) => (
            <div key={c.id} className="scert-locked-card">
              <div
                className="scert-locked-icon"
                style={{ background: c.color + '18', color: c.color }}
              >
                {c.icon}
              </div>
              <div className="scert-locked-info">
                <div className="scert-locked-title">{c.title}</div>
                <div className="scert-locked-bar-wrap">
                  <div className="scert-locked-bar">
                    <div
                      className="scert-locked-fill"
                      style={{ width: `${c.progress}%`, background: c.color }}
                    />
                  </div>
                  <span className="scert-locked-pct">{c.progress}%</span>
                </div>
                <div className="scert-locked-remaining">
                  {c.progress === 0
                    ? 'Not started yet'
                    : `${c.remaining} module${c.remaining !== 1 ? 's' : ''} remaining`}
                </div>
              </div>
              <div className="scert-locked-badge">
                <Lock size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Preview Modal ── */}
      {previewCert && (
        <div className="scert-overlay" onClick={() => setPreviewId(null)}>
          <div className="scert-modal" onClick={(e) => e.stopPropagation()}>
            <button className="scert-modal-close" onClick={() => setPreviewId(null)}>✕</button>

            <div className="scert-preview">
              <div className="scert-preview-top">
                <div className="scert-preview-logo">🎓 ITechSkillsHub</div>
                <div className="scert-preview-line" />
                <p className="scert-preview-presents">This certifies that</p>
                <h2 className="scert-preview-name">Test Student</h2>
                <p className="scert-preview-completed">has successfully completed</p>
                <h3 className="scert-preview-course" style={{ color: previewCert.color }}>
                  {previewCert.title}
                </h3>
                <div className="scert-preview-score">
                  Final Score: <strong>{previewCert.score}%</strong>  ·  Grade: <strong>{previewCert.grade}</strong>
                </div>
                <div className="scert-preview-line" />
                <div className="scert-preview-footer">
                  <div>
                    <div className="scert-preview-date">{previewCert.issuedDate}</div>
                    <div className="scert-preview-date-lbl">Date Issued</div>
                  </div>
                  <div className="scert-preview-seal" style={{ borderColor: previewCert.color }}>
                    <Award size={28} style={{ color: previewCert.color }} />
                  </div>
                  <div>
                    <div className="scert-preview-date">{previewCert.credentialId}</div>
                    <div className="scert-preview-date-lbl">Credential ID</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scert-modal-actions">
              <button className="scert-dl-btn">
                <Download size={15} /> Download PDF
              </button>
              <button className="scert-share-btn">
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
