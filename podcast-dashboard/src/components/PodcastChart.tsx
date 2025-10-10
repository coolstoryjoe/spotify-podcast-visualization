'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
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
        backgroundColor: 'rgba(17, 112, 37, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#85C093',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          family: '-apple-system, BlinkMacSystemFont, sans-serif',
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          family: '-apple-system, BlinkMacSystemFont, sans-serif',
          size: 13
        },
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
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
          color: '#666666',
          font: {
            family: '-apple-system, BlinkMacSystemFont, sans-serif',
            size: 13,
            weight: 'normal' as const
          }
        },
        border: {
          display: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(212, 212, 212, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#666666',
          font: {
            family: '-apple-system, BlinkMacSystemFont, sans-serif',
            size: 13,
            weight: 'normal' as const
          },
          callback: function(value: string | number) {
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