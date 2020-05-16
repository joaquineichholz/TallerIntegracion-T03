import React from 'react';


export default function Stock(props) {
  
  const value = props.value;
  const buy = props.buy;
  const sell = props.sell;
  const tickerToCountry = props.tickerToCountry;
  const tickerToName = props.tickerToName;

  const tickerToExchange = tickerToExchange;
  const name = {};
  const countries = {};

  var dictBuy = {};
  var dictSell = {};

  const keys1 = Object.keys(buy);

  const keys2 = Object.keys(sell);

  var keys = keys2.filter(function(obj) {return keys1.indexOf(obj) != -1; });

  var u = 0;

  for (u=0; u < keys.length; u++){

    var ticker = keys[u];

    if (tickerToName[ticker]) {
      name[ticker] = tickerToName[ticker];
    }
    else {
      name[ticker] = ':)'
    }

    if (tickerToCountry[ticker]) {
      countries[ticker] = tickerToCountry[ticker];
    }
    else {
      countries[ticker] = ':)'
    }

    // BUY 
    if (dictBuy[ticker] ){
      try {
        dictBuy[ticker] += buy[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        dictBuy[ticker] = buy[ticker].reduce(function(acc, val) { return acc + val; }, 0) 
      }
      catch (error) {
        console.error(error);
      }
    }
    // SELL 
    if (dictSell[ticker] ){
      try {
        dictSell[ticker] += sell[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        dictSell[ticker] = sell[ticker].reduce(function(acc, val) { return acc + val; }, 0)
      }
      catch (error) {
        console.error(error);
      }
    }
  }
  var delta = {};
  var lastValue = {};

  keys = Object.keys(value);
  var i = 0;

  //console.log(value);

  for (i=0; i < keys.length; i++){
    //console.log('    ', keys[i], value[keys[i]]);
    if (value[keys[i]].length > 2) {
      var x = 0;
      for (x=0; x < value[keys[i]].length - 3; x++){
        delta[keys[i]] = (value[keys[i]][value[keys[i]].length - 2 - x] - value[keys[i]][value[keys[i]].length - 1]) / value[keys[i]][value[keys[i]].length - 2 - x];
        if (delta[keys[i]] != 0) {
          break;
        }
      }

      lastValue[keys[i]] = value[keys[i]][value[keys[i]].length - 1];
      //console.log(delta)
    }
    else if (value[keys[i]].length > 1){
      delta[keys[i]] = 0;
      lastValue[keys[i]] = value[keys[i]][value[keys[i]].length - 1];
    }

    else {
      delta[keys[i]] = 0;
      lastValue[keys[i]] = 0;
    }

  }


  // 2. render the line chart using the state
  // </tr>/{buyVolume[ticker].reduce(function(acc, val) { return acc + val; }, 0).toLocaleString()} </td>
  return (
    <div>
      <h1> Stocks Information </h1>

  <table className="table"> 
    <thead>
      <tr className="table">
          <th> Name </th>
          <th> Country </th>
          <th> Ticker </th>
          <th> Total Volume  </th>
          <th> Historical HIGH  </th>
          <th> Historical LOW </th>
          <th> Last Price </th>
          <th> Delta Price (with the last different) </th>
      </tr>
      </thead>
      <thead>

      {keys.map((ticker) => (
        <tr>
            <td> {name[ticker]} </td>
            <td> {countries[ticker]} </td>
            <td> {ticker} </td>
            <td> {(dictSell[ticker] + dictSell[ticker]).toLocaleString()} </td> 
            <td> {Math.max(...value[ticker]).toLocaleString()} </td>
            <td> {Math.min(...value[ticker]).toLocaleString()} </td>
            <td> {lastValue[ticker]} </td>
            <td> {parseFloat(delta[ticker]* 100).toFixed(4)+"%"} </td>

      </tr>
        ))
        }
        </thead>
     
      </table>
    </div>
    
  );
};



  /*
  const buyVolume = props.volumeBuyByStock;



  const keys = Object.keys(buyVolume);

  // 2. render the line chart using the state
  return (

    <table className="table"> 
    <thead>
      <tr className="table">
          <th> Ticker </th>
          <th> Total Volume  </th>
          <th> Historical HIGH  </th>
          <th> Historical LOW </th>
          <th> Last Price </th>
          <th> Delta Price </th>
      </tr>
      </thead>
      <thead>

      {keys.map((ticker) => (
        <tr>
            <td> {ticker} </td>
            <td> {buyVolume[ticker].reduce(function(acc, val) { return acc + val; }, 0).toLocaleString()} </td>
            <td> {Math.max(...buyVolume[ticker]).toLocaleString()} </td>
            <td> {Math.min(...buyVolume[ticker]).toLocaleString()} </td>
            <td> {1000} </td>
            <td> {1000} </td>

      </tr>
        ))
        }
        </thead>
     
      </table>
  );
};
*/