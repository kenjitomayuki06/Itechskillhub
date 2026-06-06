import '../../styles/components/StatCard.css'

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  // Fix: `if (trend)` was falsy for trend=0, hiding valid "no change" indicators.
  // Use explicit null/undefined check instead.
  const showTrend = trend != null;

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-icon">
          <Icon size={24} />
        </div>
        {showTrend && (
          <span className={`stat-trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
}