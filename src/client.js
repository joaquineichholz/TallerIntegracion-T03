import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import './css/navbar.css'


import Disconnect from './components/disconnect';
import Connect from './components/connect';

import Exchange from './components/Exchange';
import Stock from './components/Stock';
import ChartStock from './components/ChartStock';

const protocolo = "wss://";
const servidor = "le-18262636.bitzonte.com";
const ruta = "/stocks";

const socket = io(protocolo + servidor , {
  path: ruta
  });

  
const App = ({}) => {
  

  const [stockCompanies, setstockCompanies] = useState([]);
  const [stock, setstock] = useState({});
  const [value, setvalue] = useState({})
  const [tickerToName, setTickerToName] = useState({})
  const [tickerToCountry, setTickerToCountry] = useState({})
  const [exchange, setExchange] = useState({});

  const [disconnect, setdisconnect] = useState();
  const [connect, setconnect] = useState();

  const [buy, setBuy] = useState({})
  const [sell, setSell] = useState({})

  const [tickerToExchange, setTickerToExchange] = useState({})  


 useEffect(() => {
   const nameToTicker = {};
   socket.emit('STOCKS', () => {
  })
  

  socket.on('STOCKS', data => {   
    // agrego las empresas a StockCompanies  
    for (var i = 0; i < data.length; i++) {
      setstockCompanies(currentData => [...currentData, data[i]])
 
      nameToTicker[data[i].company_name] = data[i].ticker
      setTickerToName(state => ({...state, [data[i].ticker]:  data[i].company_name}))
      setTickerToCountry(state => ({...state, [data[i].ticker]:  data[i].country}))
    }
    socket.emit('EXCHANGES', (data) => {
    });
  });

  socket.on('EXCHANGES', data => {   
    Object.keys(data).map((exchange_) => {
      var nStocks = 0;
      for (var i = 0; i < data[exchange_].listed_companies.length; i++) {
        nStocks++
        setTickerToExchange(state => ({...state, [nameToTicker[data[exchange_].listed_companies[i]]]:  exchange_}))
      }
      const init_data = {
        buyVolume: 0,
        sellVolume: 0,
        nStocks: nStocks,
        country: data[exchange_].country
      }
      setExchange(state => ({...state, [exchange_]:  init_data}))
    })
    //setExchangeInit(true)
  })
}, [])


useEffect(() => {
  socket.on('UPDATE', current => {
    var chart = {
      time: new Date(current.time).toISOString().substr(11,5),//.getHours() + ':' + new Date(current.time).toISOString().getMinutes(),
      value: current.value
    }
    setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), chart]}))
    setvalue(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), chart.value]}))
  });

}, []);


useEffect(() => {
  socket.on('BUY', current => { 
    setBuy(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current.volume]}))
  });
  }, []);
  
  useEffect(() => {
    socket.on('SELL', current => { 
      setSell(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current.volume]}))
    });
  }, []);

  return (
    <div>
            <ul className="nav-ul">
                <li className="nav-li"> <Disconnect disconnect={
                () => {
                  setdisconnect(socket.disconnect())
                  }} />  
              </li>
              <li className="nav-li"> <Connect connect={
                () => {
                  setconnect(socket.connect())
                  }} />  
              </li>
   
          </ul>
      <Exchange buy={buy} sell={sell} exchange={exchange} tickerToExchange={tickerToExchange}/>
      <Stock tickerToCountry={tickerToCountry} tickerToName={tickerToName} buy={buy} sell={sell} value={value} exchange={exchange} tickerToExchange={tickerToExchange}/>

      <div className="chartSpace">  
          {stockCompanies.map((company) => (
            <div className="chart"> 
            <h2> {company.ticker} </h2>
              <div> 
                <ChartStock key={company.ticker} data={stock[company.ticker]} />
              </div>
            </div>
            ) )     
          }
      </div>
      
    </div>
  );
  
};

ReactDOM.render(<App />, document.getElementById('root'));


