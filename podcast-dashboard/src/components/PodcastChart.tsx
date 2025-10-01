'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartData } from '@/types/podcast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PodcastChartProps {
  data: ChartData;
}

export default function PodcastChart({ data }: PodcastChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(77, 51, 38, 0.95)',
        titleColor: '#f7f3e9',
        bodyColor: '#f7f3e9',
        borderColor: '#a67c52',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          family: "'Crimson Text', Georgia, serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Source Serif Pro', Georgia, serif",
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            const hours = context.parsed.y;
            const formattedHours = hours < 1 ?
              `${Math.round(hours * 60)}m` :
              `${Math.round(hours * 10) / 10}h`;
            return `${context.dataset.label}: ${formattedHours}`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6d4c36',
          font: {
            family: "'Source Serif Pro', Georgia, serif",
            size: 13,
            weight: '500'
          }
        },
        border: {
          display: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(166, 124, 82, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#6d4c36',
          font: {
            family: "'Source Serif Pro', Georgia, serif",
            size: 13,
            weight: '500'
          },
          callback: function(value: any) {
            const hours = value as number;
            return hours < 1 ? `${Math.round(hours * 60)}m` : `${Math.round(hours)}h`;
          }
        },
        border: {
          display: false,
        }
      },
    },
  };

  return (
    <div className="h-96 w-full">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}