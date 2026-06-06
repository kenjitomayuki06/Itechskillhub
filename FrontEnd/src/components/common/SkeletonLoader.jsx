import './SkeletonLoader.css';

/* ── Base shimmer block ── */
export function Skeleton({ width = '100%', height = '16px', borderRadius = '6px', style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

/* ── Stat card skeleton (matches StatCard layout) ── */
export function StatCardSkeleton() {
  return (
    <div className="stat-card-skeleton">
      <div className="sks-header">
        <Skeleton width="44px" height="44px" borderRadius="10px" />
        <Skeleton width="52px" height="18px" borderRadius="20px" />
      </div>
      <Skeleton width="70px" height="32px" borderRadius="6px" style={{ marginTop: '12px' }} />
      <Skeleton width="110px" height="14px" borderRadius="6px" style={{ marginTop: '8px' }} />
    </div>
  );
}

/* ── Dashboard stats grid skeleton ── */
export function StatsGridSkeleton({ count = 4 }) {
  return (
    <div className="stats-grid-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Chart card skeleton ── */
export function ChartSkeleton({ height = 260 }) {
  return (
    <div className="chart-skeleton">
      <Skeleton width="180px" height="20px" borderRadius="6px" />
      <div className="chart-skeleton-bars" style={{ height }}>
        {[65, 85, 50, 95, 70, 80, 60].map((h, i) => (
          <div key={i} className="chart-skeleton-bar-wrap">
            <Skeleton
              width="100%"
              height={`${h}%`}
              borderRadius="6px 6px 0 0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Table row skeleton ── */
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="table-row-skeleton">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <Skeleton
            width={i === 0 ? '140px' : i === cols - 1 ? '60px' : '90px'}
            height="14px"
          />
        </td>
      ))}
    </tr>
  );
}

/* ── Table skeleton ── */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-skeleton-wrap">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="table-skeleton-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              width={j === 0 ? '40%' : j === cols - 1 ? '10%' : '15%'}
              height="14px"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Course list item skeleton ── */
export function CourseItemSkeleton() {
  return (
    <div className="course-item-skeleton">
      <Skeleton width="44px" height="44px" borderRadius="10px" style={{ flexShrink: 0 }} />
      <div className="cis-content">
        <Skeleton width="75%" height="15px" />
        <Skeleton width="45%" height="12px" style={{ marginTop: '6px' }} />
        <Skeleton width="100%" height="6px" borderRadius="3px" style={{ marginTop: '10px' }} />
      </div>
      <Skeleton width="32px" height="32px" borderRadius="50%" style={{ flexShrink: 0 }} />
    </div>
  );
}

/* ── Activity item skeleton ── */
export function ActivityItemSkeleton() {
  return (
    <div className="activity-item-skeleton">
      <Skeleton width="32px" height="32px" borderRadius="50%" style={{ flexShrink: 0 }} />
      <div className="ais-content">
        <Skeleton width="80%" height="14px" />
        <Skeleton width="50px" height="11px" style={{ marginTop: '5px' }} />
      </div>
    </div>
  );
}

/* ── Full dashboard skeleton for AdminDashboard ── */
export function AdminDashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Header */}
      <div className="dsk-header">
        <Skeleton width="220px" height="28px" />
        <Skeleton width="300px" height="16px" style={{ marginTop: '8px' }} />
      </div>

      {/* Stats */}
      <StatsGridSkeleton count={4} />

      {/* Charts */}
      <div className="dsk-charts-row">
        <div className="dsk-chart-card"><ChartSkeleton height={240} /></div>
        <div className="dsk-chart-card"><ChartSkeleton height={240} /></div>
      </div>

      {/* Activity */}
      <div className="dsk-activity-card">
        <Skeleton width="140px" height="18px" style={{ marginBottom: '16px' }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <ActivityItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Full dashboard skeleton for StudentDashboard ── */
export function StudentDashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Welcome banner */}
      <div className="dsk-welcome">
        <div>
          <Skeleton width="120px" height="16px" />
          <Skeleton width="200px" height="32px" style={{ marginTop: '8px' }} />
          <Skeleton width="260px" height="14px" style={{ marginTop: '8px' }} />
        </div>
        <div className="dsk-welcome-stats">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="dsk-welcome-stat">
              <Skeleton width="48px" height="28px" />
              <Skeleton width="80px" height="12px" style={{ marginTop: '6px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <StatsGridSkeleton count={4} />

      {/* Main grid */}
      <div className="dsk-main-grid">
        <div className="dsk-left">
          <div className="dsk-card">
            <Skeleton width="130px" height="18px" style={{ marginBottom: '16px' }} />
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseItemSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="dsk-right">
          <div className="dsk-card">
            <Skeleton width="160px" height="18px" style={{ marginBottom: '16px' }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}