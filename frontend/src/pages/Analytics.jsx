import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = [
  '#0057B7', '#00C896', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#10B981', '#3B82F6',
  '#F97316', '#06B6D4', '#6366F1', '#D946EF'
];

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-10 text-center">Loading Analytics...</div>;

  const { featureBreakdown, reportsOverTime } = data;

  const cityScores = [
    { name: 'Chennai', score: 85 },
    { name: 'Mumbai', score: 72 },
    { name: 'Delhi', score: 68 },
    { name: 'Bengaluru', score: 80 }
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Accessibility Analytics</h1>
        <p className="text-gray-600 mb-8">System-wide statistics on features, ratings, and inclusions.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Doughnut Chart - Features */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-6 text-center text-gray-800">Accessibility Features Distribution</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {featureBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart - Reports over time */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-6 text-center text-gray-800">Reports Submitted (Last 6 Months)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0057B7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0057B7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="reports" stroke="#0057B7" fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart - City Scores */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Inclusion Index by City</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} maxBarSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {cityScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#00C896' : entry.score > 70 ? '#0057B7' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
