import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import http from '../http';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
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

function Linechart() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    http.get('/user/pastSignUps').then((res) => {
      console.log(res.data);
      let tempData = [];
      let tempLabels = [];
      res.data.forEach(entry => {
        tempLabels.push(entry.month);
        tempData.push(entry.count);
      });
      setData(tempData);
      setLabels(tempLabels);
      console.log(tempData)
      console.log(tempLabels)
    });
  }, []);

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Number of Signups',
        data: data,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <>
      <h5 style={{ textAlign: 'center', marginBottom: '10px', color: 'black' }}>
        Recent User Signups in a year
      </h5>
      {<Line options={options} data={lineData}/> }
    </>
  )
}
export default Linechart
