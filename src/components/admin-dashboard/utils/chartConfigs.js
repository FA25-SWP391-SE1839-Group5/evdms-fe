export const orderStatisticsChartConfig = {
  series: [85, 15, 50, 25],
  chart: {
    height: 165,
    width: 130,
    type: 'donut'
  },
  labels: ['Electronic', 'Fashion', 'Decor', 'Sports'],
  colors: ['#696cff', '#71dd37', '#03c3ec', '#a8aaae'],
  stroke: {
    width: 5,
    colors: ['#fff']
  },
  dataLabels: {
    enabled: false,
    formatter: function (val, opt) {
      return parseInt(val) + '%';
    }
  },
  legend: {
    show: false
  },
  grid: {
    padding: {
      top: 0,
      bottom: 0,
      right: 15
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '1.5rem',
            fontFamily: 'Public Sans',
            color: '#697a8d',
            fontWeight: 500,
            offsetY: -15,
            formatter: function (val) {
              return parseInt(val) + '%';
            }
          },
          name: {
            offsetY: 20,
            fontFamily: 'Public Sans'
          },
          total: {
            show: true,
            fontSize: '0.8125rem',
            color: '#697a8d',
            label: 'Weekly',
            formatter: function (w) {
              return '38%';
            }
          }
        }
      }
    }
  }
};

// Income Chart Config
export const incomeChartConfig = {
  series: [
    {
      data: [24, 21, 30, 22, 42, 26, 35, 29]
    }
  ],
  chart: {
    height: 215,
    parentHeightOffset: 0,
    parentWidthOffset: 0,
    toolbar: {
      show: false
    },
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 2,
    curve: 'smooth'
  },
  legend: {
    show: false
  },
  markers: {
    size: 6,
    colors: 'transparent',
    strokeColors: 'transparent',
    strokeWidth: 4,
    discrete: [
      {
        fillColor: '#fff',
        seriesIndex: 0,
        dataPointIndex: 7,
        strokeColor: '#696cff',
        strokeWidth: 2,
        size: 6,
        radius: 8
      }
    ],
    hover: {
      size: 7
    }
  },
  colors: ['#696cff'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.6,
      opacityFrom: 0.5,
      opacityTo: 0.25,
      stops: [0, 95, 100]
    }
  },
  grid: {
    borderColor: '#f0f2f8',
    strokeDashArray: 3,
    padding: {
      top: -20,
      bottom: -8,
      left: -10,
      right: 8
    }
  },
  xaxis: {
    categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: true,
      style: {
        fontSize: '13px',
        colors: '#697a8d'
      }
    }
  },
  yaxis: {
    labels: {
      show: false
    },
    min: 10,
    max: 50,
    tickAmount: 4
  }
};

// Profile Report Chart Config
export const profileReportChartConfig = {
  chart: {
    height: 80,
    width: 175,
    type: 'line',
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      top: 10,
      left: 5,
      blur: 3,
      color: '#ffab00',
      opacity: 0.15
    },
    sparkline: {
      enabled: true
    }
  },
  colors: ['#ffab00'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  series: [
    {
      data: [110, 270, 145, 245, 205, 285]
    }
  ],
  xaxis: {
    show: false,
    lines: {
      show: false
    },
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    theme: 'dark',
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return 'Visits';
        }
      }
    },
    marker: {
      show: false
    }
  }
};

// Expenses of Week Chart Config
export const expensesOfWeekChartConfig = {
  series: [65],
  chart: {
    width: 60,
    height: 60,
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360,
      strokeWidth: '8',
      hollow: {
        margin: 2,
        size: '45%'
      },
      track: {
        strokeWidth: '50%',
        background: '#f0f2f8'
      },
      dataLabels: {
        show: true,
        name: {
          show: false
        },
        value: {
          formatter: function (val) {
            return '$' + parseInt(val);
          },
          offsetY: 5,
          color: '#697a8d',
          fontSize: '13px',
          show: true
        }
      }
    }
  },
  fill: {
    type: 'solid',
    colors: ['#696cff']
  },
  stroke: {
    lineCap: 'round'
  },
  grid: {
    padding: {
      top: -10,
      bottom: -15,
      left: -10,
      right: -10
    }
  },
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    },
    active: {
      filter: {
        type: 'none'
      }
    }
  }
};