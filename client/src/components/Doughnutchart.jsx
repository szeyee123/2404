import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import http from '../http';

ChartJS.register(ArcElement, Tooltip, Legend);

function Doughnutchart() {
  const [numActive, setNumActive] = useState(null);
  const [numBlocked, setNumBlocked] = useState(null);

  useEffect(() => {
    http.get('/user/status')
      .then((res) => {
        setNumActive(res.data.active);
        setNumBlocked(res.data.blocked);
      })
      .catch((error) => {
        console.error('Error fetching user stats:', error);
      });
  }, []);

  if (numActive === null || numBlocked === null) {
    return <p>Loading chart...</p>;
  }

  const totalUsers = numActive + numBlocked;
  const activePercentage = totalUsers > 0 ? ((numActive / totalUsers) * 100).toFixed(1) : '0.0';

  const data = {
    labels: ['Active Users', 'Blocked Users'],
    datasets: [
      {
        label: 'User Status',
        data: [numActive, numBlocked],
        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const percentage = totalUsers > 0 ? ((value / totalUsers) * 100).toFixed(1) : '0.0';
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      centerText: {
        text: `${activePercentage}% Active`, // Pass text dynamically
      },
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      const text = chart.config.options.plugins.centerText.text;
  
      ctx.save(); // Save canvas state
  
      const fontSize = Math.min(height / 15, 20); // Adjust max font size
      ctx.font = `${fontSize}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
  
      ctx.fillText(text, width / 2, height / 2); // Draw text in center
  
      ctx.restore(); // Restore canvas state
    },
  };
  

  return ( <>
    <h5 style={{ textAlign: 'center', marginBottom: '10px', color: 'black' }}>
      Percentage of Active Users
    </h5>
    <Doughnut data={data} options={options} plugins={[centerTextPlugin]}></Doughnut>
    </>
    )
}

export default Doughnutchart;
