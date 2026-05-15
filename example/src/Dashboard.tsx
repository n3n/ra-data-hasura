import * as React from 'react';
import { useAggregate } from 'ra-data-hasura';

const AGGREGATE_PARAMS = {
  aggregate: {
    count: true,
    sum: ['price'] as const,
    avg: ['price'] as const,
  },
  filter: { status: 'paid' },
} as const;

const cardStyle: React.CSSProperties = {
  padding: 16,
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  minWidth: 140,
};
const labelStyle: React.CSSProperties = { fontSize: 12, color: '#666' };
const valueStyle: React.CSSProperties = { fontSize: 24, fontWeight: 600 };

const Dashboard = () => {
  const { data, isLoading, error } = useAggregate('order', AGGREGATE_PARAMS);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading stats</p>;

  const stats = data?.data;
  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <KpiCard label="Paid orders" value={stats?.count ?? 0} />
      <KpiCard
        label="Total revenue"
        value={`$${(stats?.sum?.price ?? 0).toFixed(2)}`}
      />
      <KpiCard
        label="Avg order value"
        value={`$${(stats?.avg?.price ?? 0).toFixed(2)}`}
      />
    </div>
  );
};

const KpiCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div style={cardStyle}>
    <div style={labelStyle}>{label}</div>
    <div style={valueStyle}>{value}</div>
  </div>
);

export default Dashboard;
