import { useState, useEffect } from 'react';
import useCharts from '../hooks/useCharts';

const TotalRevenue = () => {
  const [selectedYear, setSelectedYear] = useState('2022');

  // Chart configuration
  const totalRevenueChartConfig = {
    series: [
      {
        name: '2021',
        data: [18, 7, 15, 29, 18, 12, 9]
      },
      {
        name: '2022',
        data: [-13, -18, -9, -14, -5, -17, -15]
      }
    ],
    chart: {
      height: 300,
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '33%',
        borderRadius: 12,
        startingShape: 'rounded',
        endingShape: 'rounded'
      }
    },
    colors: ['#696cff', '#8592a3'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 6,
      lineCap: 'round',
      colors: ['transparent']
    },
    legend: {
      show: true,
      horizontalAlign: 'left',
      position: 'top',
      markers: {
        height: 8,
        width: 8,
        radius: 12,
        offsetX: -3
      },
      labels: {
        colors: '#697a8d'
      },
      itemMargin: {
        horizontal: 10
      }
    },
    grid: {
      borderColor: '#f0f2f8',
      padding: {
        top: 0,
        bottom: -8,
        left: 20,
        right: 20
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          fontSize: '13px',
          colors: '#697a8d'
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '13px',
          colors: '#697a8d'
        }
      }
    },
    responsive: [
      {
        breakpoint: 1700,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '32%'
            }
          }
        }
      },
      {
        breakpoint: 1580,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '35%'
            }
          }
        }
      },
      {
        breakpoint: 1440,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '42%'
            }
          }
        }
      },
      {
        breakpoint: 1300,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '48%'
            }
          }
        }
      },
      {
        breakpoint: 1200,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '40%'
            }
          }
        }
      },
      {
        breakpoint: 1040,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 11,
              columnWidth: '48%'
            }
          }
        }
      },
      {
        breakpoint: 991,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '30%'
            }
          }
        }
      },
      {
        breakpoint: 840,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '35%'
            }
          }
        }
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '28%'
            }
          }
        }
      },
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '32%'
            }
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '37%'
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: 420,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '52%'
            }
          }
        }
      },
      {
        breakpoint: 380,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '60%'
            }
          }
        }
      }
    ],
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

  // Initialize chart
  useCharts('#totalRevenueChart', totalRevenueChartConfig);

  return (
    <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
      <div className="card">
        <div className="row row-bordered g-0">
          <div className="col-md-8">
            <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
            <div id="totalRevenueChart" className="px-2">
              {/* Chart sẽ được render ở đây bằng ApexCharts hoặc library khác */}
              <div className="text-center py-5 text-muted">
                Chart will be rendered here
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-body">
              <div className="text-center">
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-primary dropdown-toggle"
                    type="button"
                    id="growthReportId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {selectedYear}
                  </button>
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="growthReportId"
                  >
                    <a 
                      className="dropdown-item" 
                      href="javascript:void(0);"
                      onClick={() => setSelectedYear('2021')}
                    >
                      2021
                    </a>
                    <a 
                      className="dropdown-item" 
                      href="javascript:void(0);"
                      onClick={() => setSelectedYear('2020')}
                    >
                      2020
                    </a>
                    <a 
                      className="dropdown-item" 
                      href="javascript:void(0);"
                      onClick={() => setSelectedYear('2019')}
                    >
                      2019
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div id="growthChart">
              {/* Growth Chart */}
            </div>
            <div className="text-center fw-semibold pt-3 mb-2">
              62% Company Growth
            </div>
            <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
              <div className="d-flex">
                <div className="me-2">
                  <span className="badge bg-label-primary p-2">
                    <i className="bx bx-dollar text-primary" />
                  </span>
                </div>
                <div className="d-flex flex-column">
                  <small>2022</small>
                  <h6 className="mb-0">$32.5k</h6>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-2">
                  <span className="badge bg-label-info p-2">
                    <i className="bx bx-wallet text-info" />
                  </span>
                </div>
                <div className="d-flex flex-column">
                  <small>2021</small>
                  <h6 className="mb-0">$41.2k</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenue;