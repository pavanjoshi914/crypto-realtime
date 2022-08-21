import { Line } from "react-chartjs-2";

import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  } from 'chart.js';
import { useEffect, useState } from "react";
  
  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  );

// renders currency pair chart and price
export function Dashboard({ price, data }) {
  
  // when there is change in data variable i.e data contains original data by coinbased then rerender component
  const [dataNotEmpty, setdataNotEmpty] = useState([]);
  // rerender component when value of data is changed
  useEffect(() => {
    if(Object.keys(data).length != 0){
    setdataNotEmpty(data);
    }
  }, [data]);
  // after select tag is used and data fetch is delayed, here data passed contain empty object which creates plugin error
  console.log(data);
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    
    scales: {
        y: {
          ticks: { color: 'white', beginAtZero: true }
        },
        x: {
          ticks: { color: 'white', beginAtZero: true }
        }
    },
      

    responsive: true,
    maintainAspectRatio: false
  };
  if (price === "0.00") {
    return <h2>please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      <h2>{`$${price}`}</h2>

      <div className="chart-container">
      
     {// if data is not empty then only render plugin code, to avoid error
     Object.keys(dataNotEmpty).length != 0 && <Line  id='canvas' data={data} options={opts} />}
      </div>
    </div>
  );
}

export default Dashboard;