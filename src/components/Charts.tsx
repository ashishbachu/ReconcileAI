
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

interface DataItem {
  name: string;
  value: number;
}

export const CustomPieChart = ({ data, title }: { data: DataItem[], title?: string }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      {title && <h3 style={{ fontSize: '14px', marginBottom: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>{title}</h3>}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CustomBarChart = ({ data, title }: { data: DataItem[], title?: string }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      {title && <h3 style={{ fontSize: '14px', marginBottom: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>{title}</h3>}
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
          <Tooltip cursor={{ fill: 'var(--bg-card-hover)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
          <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
