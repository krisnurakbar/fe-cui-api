import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, LinearScale, PointElement, Title, CategoryScale } from "chart.js";
import projectProgressService from "../services/projectProgressService";

ChartJS.register(Tooltip, Legend, LinearScale, PointElement, Title, CategoryScale);

const categoryColors = ['#3498db', '#e74c3c', '#2ecc71']; // Array of category colors by index

const QuadrantChart = () => {
  const [data, setData] = useState({
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const company_id = localStorage.getItem('companyId');
      const response = await projectProgressService.projectProgressView(
        { params: { company_id } }
      );
      const dataFromAPI = response.data;
      const groupedData = dataFromAPI.reduce((acc, item) => {
        const { project_type, cpi, spi, project_name } = item;
        if (!acc[project_type]) {
          const colorIndex = Object.keys(acc).length % categoryColors.length; // Cycle through colors
          acc[project_type] = {
            label: project_type,
            data: [],
            backgroundColor: categoryColors[colorIndex]
          };
        }
        acc[project_type].data.push({ x: cpi, y: spi, projectName: project_name });
        return acc;
      }, {});
      setData({
        datasets: Object.values(groupedData)
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: 2,
        grid: {
          color: (context) => (context.tick.value === 1 ? "black" : "#ddd"),
          lineWidth: (context) => (context.tick.value === 1 ? 2 : 1)
        },
        title: {
          display: true,
          text: "Cost Performance Index (CPI)"
        }
      },
      y: {
        type: "linear",
        min: 0,
        max: 2,
        grid: {
          color: (context) => (context.tick.value === 1 ? "black" : "#ddd"),
          lineWidth: (context) => (context.tick.value === 1 ? 2 : 1)
        },
        title: {
          display: true,
          text: "Schedule Performance Index (SPI)"
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end"
      },

      title: {
        display: true,
        position: "top",
        align: "start",
        text: "Project Performance Monitor"
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const point = context.raw;
            return [
              `Project: ${point.projectName}`,
              `SPI: ${point.y}`,
              `CPI: ${point.x}`,
            ];
          }
        },
        displayColors: false,
        footerMarginTop: 12
      }
    },
    elements: {
      point: {
        radius: 8,
        hoverRadius: 8
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "50%", margin: "8px" }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default QuadrantChart;

