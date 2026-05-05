import * as React from 'react';
import { useAggregate } from 'ra-data-hasura';

/**
 * KPI dashboard panel showing aggregate stats for orders.
 *
 * Requires ra-data-hasura >= 0.8.0 and react-admin v5.
 */
const Dashboard = () => {
  const { data, isLoading, error } = useAggregate('order', {
    aggregate: {
      count: true,
      sum: ['price'] as const,
      avg: ['price'] as const,
    },
    filter: { status: 'paid' },
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading stats</p>;

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <KpiCard label="Paid orders" value={data?.data.count ?? 0} />
      <KpiCard
        label="Total revenue"
        value={`$${(data?.data.sum?.price ?? 0).toFixed(2)}`}
      />
      <KpiCard
        label="Avg order value"
        value={`$${(data?.data.avg?.price ?? 0).toFixed(2)}`}
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
  <div
    style={{
      padding: 16,
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      minWidth: 140,
    }}
  >
    <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
  </div>
);

export default Dashboard;
