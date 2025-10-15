import { useEffect } from 'react';

const useCharts = (chartId, chartConfig) => {
  useEffect(() => {
    let chart = null;

    const initChart = () => {
      const chartElement = document.querySelector(chartId);
      
      if (chartElement && window.ApexCharts) {
        // Clear existing chart if any
        chartElement.innerHTML = '';
        
        // Create new chart
        chart = new window.ApexCharts(chartElement, chartConfig);
        chart.render();
      }
    };

    // Wait for ApexCharts to load
    const checkApexCharts = setInterval(() => {
      if (window.ApexCharts) {
        initChart();
        clearInterval(checkApexCharts);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkApexCharts);
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartId, chartConfig]);
};

export default useCharts;