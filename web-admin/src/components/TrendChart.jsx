import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useTheme } from '../context/ThemeContext'

export default function TrendChart({ data, color, title='Completions' }){
  const { theme } = useTheme();
  
  // Determine colors based on theme
  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipText = isDark ? '#e6eef8' : '#0f172a';
  
  // Default primary color if not provided
  const chartColor = color || (isDark ? '#60a5fa' : '#0ea5e9');

  return (
    <div className="w-full h-full">
      <div style={{width:'100%', height:220}}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.6}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={axisColor} tick={{fill: axisColor}} />
            <YAxis stroke={axisColor} tick={{fill: axisColor}} />
            <Tooltip 
              contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText, borderRadius: '0.5rem' }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: axisColor }}
            />
            <Area type="monotone" dataKey="count" stroke={chartColor} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
