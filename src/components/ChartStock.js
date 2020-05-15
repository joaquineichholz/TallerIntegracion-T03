import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';



export default function ChartStock(props) {
  const [dataUpdate, setDataUpdate] = useState([]);

  
  const data = props.data;

 var ticker = 'NaN'
  if (dataUpdate.length > 0){
    ticker = dataUpdate[0].ticker
  }

  // 2. render the line chart using the state
  return (
    <div>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="tima" />
        <YAxis  label={{ value:"Value", angle: -90, position:"insideLeft" }}/>
        <Tooltip/>

        <Line time="monotone" dataKey="value" stroke="#999" activeDot={{r: 8}} />
      </LineChart>

    </div>
  );
};