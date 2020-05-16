import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';



export default function Exchange(props) {
  
  const buy = props.buy;
  const sell = props.sell;
  const tickerToExchange = props.tickerToExchange;
  const exchange_ = props.exchange;

  const nStocks = {};

  var dictBuy = {};
  var dictSell = {};

  var totalVolume = 0;

  const keys1 = Object.keys(buy);

  const keys2 = Object.keys(sell);

  var keys = keys2.filter(function(obj) {return keys1.indexOf(obj) != -1; });

  var u = 0;


  for (u=0; u < keys.length; u++){

    var ticker = keys[u];
    var exchange = tickerToExchange[ticker];

    // check nStock
    if (!nStocks[exchange]){
      nStocks[exchange] = 1;
    }

    // BUY 
    if (dictBuy[exchange] ){
      try {
        dictBuy[exchange] += buy[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        dictBuy[exchange] = buy[ticker].reduce(function(acc, val) { return acc + val; }, 0) 
      }
      catch (error) {
        console.error(error);
      }
    }

    // SELL 
    if (dictSell[exchange] ){
      try {
        dictSell[exchange] += sell[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        dictSell[exchange] = sell[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
  }

  var i = 0;
  for (i=0; i < Object.keys(dictBuy).length; i++){
    var exchange = Object.keys(dictBuy)[i];
    totalVolume += dictBuy[exchange] + dictSell[exchange]
    
    if (exchange_[exchange]) {
      nStocks[exchange] = exchange_[exchange].nStocks;
    }
    else {
      nStocks[exchange] = 2;
    }
    }
  

  // 2. render the line chart using the state
  return (

    <div>
      <h1> Exchanges Information</h1>
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

      {Object.keys(dictBuy).map((exchange) => (
        <tr>
            <td> {exchange} </td>
            <td> {dictBuy[exchange].toLocaleString()} </td>
            <td> {dictSell[exchange].toLocaleString()} </td>
            <td> {(dictBuy[exchange] + dictSell[exchange]).toLocaleString()} </td>
            <td> {nStocks[exchange].toLocaleString()} </td>
            <td> {parseFloat((dictBuy[exchange] + dictSell[exchange]) * 100/ totalVolume ).toFixed(4)+"%"} </td>  
            </tr>
        ))
        }
        </thead>
     
      </table>
    </div>
    
  );
};



/*

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

*/