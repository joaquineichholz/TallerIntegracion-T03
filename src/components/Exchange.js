import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';




export default function Exchange(props) {
  
  const exchange = props.exchange;
  const totalVolume = props.totalVolume;


  // 2. render the line chart using the state
  return (
    <table className="table"> 
      <tr className="table">
          <th> Ticker </th>
          <th> BUY Volume  </th>
          <th> SELL Volume </th>
          <th> Total Volume </th>
          <th> N Stock </th>
          <th> Participation </th>
      </tr>
      {Object.keys(exchange).map((ticker) => (
        <tr>
            <td> {ticker} </td>
            <td> {exchange[ticker].volumeBuy} </td>
            <td> {exchange[ticker].volumenSell} </td>
            <td> {exchange[ticker].volumeBu + exchange[ticker].volumenSell} </td>
            <td> {exchange[ticker].nStock} </td>
            <td> {(exchange[ticker].volumeBu + exchange[ticker].volumenSell) / totalVolume} </td>
        </tr>
        ))
        }
     
      </table>
  );
};