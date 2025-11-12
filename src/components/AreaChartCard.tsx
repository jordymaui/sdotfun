import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export function AreaChartCard({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey,
  color = '#27C07D',
}: AreaChartCardProps) {
  return (
    <div className="rounded-xl bg-card p-6 border border-stroke shadow-card">
      <div className="mb-6">
        <h3 className="text-[18px] font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-[14px] text-dim mt-1">{subtitle}</p>}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#A8B0C2"
              tick={{ fill: '#A8B0C2', fontSize: 12 }}
              axisLine={{ stroke: '#2A3140' }}
            />
            <YAxis
              stroke="#A8B0C2"
              tick={{ fill: '#A8B0C2', fontSize: 12 }}
              axisLine={{ stroke: '#2A3140' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141820',
                border: '1px solid #2A3140',
                borderRadius: '8px',
                color: '#E9EEF7',
              }}
              labelStyle={{ color: '#A8B0C2' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
