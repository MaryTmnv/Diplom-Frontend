import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TicketsChartProps {
  period: string;
}

// Mock данные
const data = [
  { date: 'Пн', new: 12, resolved: 8, inProgress: 15 },
  { date: 'Вт', new: 19, resolved: 15, inProgress: 18 },
  { date: 'Ср', new: 15, resolved: 20, inProgress: 12 },
  { date: 'Чт', new: 22, resolved: 18, inProgress: 16 },
  { date: 'Пт', new: 28, resolved: 25, inProgress: 14 },
  { date: 'Сб', new: 8, resolved: 12, inProgress: 10 },
  { date: 'Вс', new: 5, resolved: 8, inProgress: 7 },
];

export const TicketsChart = ({ period }: TicketsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
        <Line 
          type="monotone" 
          dataKey="new" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Новые"
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="resolved" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Решённые"
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="inProgress" 
          stroke="#f59e0b" 
          strokeWidth={2}
          name="В работе"
          dot={{ fill: '#f59e0b', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
