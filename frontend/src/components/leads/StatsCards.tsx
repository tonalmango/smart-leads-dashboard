import { Users, TrendingUp, Target, XCircle } from 'lucide-react';
import { LeadStats, LeadStatus } from '@/types';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  stats: LeadStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCardProps[] = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: <Users size={22} className="text-blue-600" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Qualified',
      value: stats.byStatus[LeadStatus.Qualified] ?? 0,
      icon: <TrendingUp size={22} className="text-green-600" />,
      color: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Contacted',
      value: stats.byStatus[LeadStatus.Contacted] ?? 0,
      icon: <Target size={22} className="text-yellow-600" />,
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Lost',
      value: stats.byStatus[LeadStatus.Lost] ?? 0,
      icon: <XCircle size={22} className="text-red-600" />,
      color: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
