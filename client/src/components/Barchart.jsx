import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import http from '../http';

function Barchart() {
  const [numActive, setNumActive] = useState();
  const [numBlocked, setNumBlocked] = useState();

  useEffect(() => {
    http.get('/user/status').then((res) => {
      console.log(res.data);
      setNumActive(res.data.active);
      setNumBlocked(res.data.blocked);
    });
  }, []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Ensures only whole numbers are used
          callback: function(value) {
            return Number.isInteger(value) ? value : null; // Hide non-integer values
          }
        },
      },
    },
  };

  const barLabels = ['Status'];

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Active',
        data: [numActive],
        backgroundColor: 'rgba(105, 163, 115, 0.7)',
      },
      {
        label: 'Blocked',
        data: [numBlocked],
        backgroundColor: 'rgba(175, 58, 58, 0.7)',
      },
    ],
  };

  return (
    <>
      <h5 style={{ textAlign: 'center', marginBottom: '10px', color: 'black' }}>
      Active vs Blocked
      </h5>
      {barData && barOptions ? <Bar options={barOptions} data={barData} /> : <p>Loading Chart...</p>}
      </>
  )
}

export default Barchart