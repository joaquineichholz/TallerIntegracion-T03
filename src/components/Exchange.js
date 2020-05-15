import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';




export default function Exchange(props) {
  
  const exchange = props.exchange;
  var totalVolume = 1;

  const keys = Object.keys(exchange);

  var i = 0;
  for (i=0; i < keys.length; i++){
    totalVolume = exchange[keys[i]].buyVolume + exchange[keys[i]].sellVolume + totalVolume
  }

  // 2. render the line chart using the state
  return (

    <table className="table"> 
    <thead>
      <tr className="table">
          <th> Exchange </th>
          <th> BUY Volume  </th>
          <th> SELL Volume </th>
          <th> Total Volume </th>
          <th> N Stocks </th>
          <th> Participation </th>
      </tr>
      </thead>
      <thead>

      {Object.keys(exchange).map((ticker) => (
        <tr>
            <td> {ticker} </td>
            <td> {exchange[ticker].buyVolume.toLocaleString()} </td>
            <td> {exchange[ticker].sellVolume.toLocaleString()} </td>
            <td> {(exchange[ticker].buyVolume + exchange[ticker].sellVolume).toLocaleString()} </td>
            <td> {exchange[ticker].nStocks.toLocaleString()} </td>
            <td> {parseFloat((exchange[ticker].buyVolume + exchange[ticker].sellVolume) * 100 / totalVolume).toFixed(2)+"%" } </td>
        
            </tr>
        ))
        }
        </thead>
     
      </table>
  );
};