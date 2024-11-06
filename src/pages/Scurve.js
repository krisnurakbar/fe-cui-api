import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { LineChart } from '@mui/x-charts/LineChart';
import projectService from '../services/projectService'; // Assuming you have a projectService for API calls
import dayjs from 'dayjs';

const Scurve = () => {
  const { projectId } = useParams(); // Get project_id from URL parameters
  const [chartData, setChartData] = useState({
    reportDates: [],
    planProgress: [],
    actualProgress: []
  });

  useEffect(() => {
    console.log('useEffect triggered'); // Debug log
    console.log('projectId:', projectId); // Debug log
    const fetchProgressData = async () => {
      try {
        console.log(`Fetching progress data for projectId: ${projectId}`);

        const response = await projectService.projectProgress(projectId);
        const progressData = response.data;

        if (!Array.isArray(progressData) || progressData.length === 0) {
          console.warn('No progress data received.');
          return;
        }

        // Extract data for the chart in one mapping and sort by report_date
        const chartData = progressData.map(item => ({
          reportDate: item.report_date || '',
          planProgress: item.plan_progress
            ? parseFloat(item.plan_progress.toString().replace('%', '')) // Ensure plan_progress is a string before using replace
            : 0, // Default to 0 if plan_progress is null or undefined
          actualProgress: item.actual_progress !== undefined && item.actual_progress !== null
            ? parseFloat(item.actual_progress.toString().replace('%', '')) // Ensure actual_progress is a string before using replace
            : null, // Default to null if actual_progress is missing
          week_no: item.week_no || 0,
        }));

        // Sort the data by reportDate in ascending order
        chartData.sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate));

        // Separate the sorted data back into individual arrays
        const reportDates = chartData.map(item => item.reportDate);
        const planProgress = chartData.map(item => item.planProgress);
        const actualProgress = chartData.map(item => item.actualProgress);
        const week_no = chartData.map(item => item.week_no);

        setChartData({ reportDates, planProgress, actualProgress, week_no });
        console.log('Data set successfully in state:', { reportDates, planProgress, actualProgress, week_no });
      } catch (error) {
        console.error('Error fetching project progress data:', error);
      }
    };


    if (projectId) {
      fetchProgressData(); // Fetch data only if projectId is provided
    }
  }, [projectId]); // Re-fetch data if projectId changes

  const { reportDates, planProgress, actualProgress, week_no } = chartData;

  return (
    <div style={{ height: 'calc(81vh - 0px)', width: "100%" }}>
      <h2>S-curve Chart</h2>
      <div style={{ height: 'calc(100vh - 170px)', width: "100%", overflow: "hidden"}}>
        
        <LineChart
          series={[
            { label: 'Planned Progress (%)', data: planProgress, color: 'red' },
            { label: 'Actual Progress (%)', data: actualProgress, color: 'green' },
          ]}
          xAxis={[
            {
              title: 'Report Date',
              data: reportDates,
              scaleType: 'point',
              valueFormatter: (value) => dayjs(value).format('DD MMM YYYY'),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Scurve;
