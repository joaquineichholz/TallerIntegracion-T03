import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import './css/navbar.css'


import Disconnect from './components/disconnect';
import Connect from './components/connect';
import Exchange from './components/Exchange';

import ChartStock from './components/ChartStock';

const protocolo = "wss://";
const servidor = "le-18262636.bitzonte.com";
const ruta = "/stocks";

const socket = io(protocolo + servidor , {
  path: ruta
  });

const exchangeSocket = io(protocolo + servidor , {
  path: ruta
  });

const stockSocket = io(protocolo + servidor , {
  path: ruta
  });
  
  
  


const App = ({}) => {
  
  const [stockCompanies, setstockCompanies] = useState([]);
  const [stock, setstock] = useState({});
  const [stockInit, setStockInit] = useState(false);
  const [exchangeInit, setExchangeInit] = useState(false);

  const [newBuy, setnewBuy] = useState(0)

  const [disconnect, setdisconnect] = useState();
  const [connect, setconnect] = useState();

  const [exchange, setExchange] = useState({});
  const [buy, setBuy] = useState({})
  const [sell, setSell] = useState({})

  const [totalVolume, setTotalVolume] = useState(0.00001);

  //const [nameToTicker, setNameToTicker] = useState({});
  const [tickerToExchange, setTickerToExchange] = useState({})  


 useEffect(() => {
   const nameToTicker = {};

  stockSocket.emit('STOCKS', () => {
  })
  

  stockSocket.on('STOCKS', data => {   
    console.log('---------')
    // agrego las empresas a StockCompanies  
    for (var i = 0; i < data.length; i++) {
      setstockCompanies(currentData => [...currentData, data[i]])
      //setNameToTicker(state => ({...state, [data[i].company_name]:  data[i].ticker}))
      nameToTicker[data[i].company_name] = data[i].ticker
    }
    setStockInit(true);
    //stockSocket.disconnect()
    exchangeSocket.emit('EXCHANGES', (data) => {
    });
  });

  exchangeSocket.on('EXCHANGES', data => {   
    Object.keys(data).map((exchange_) => {
      var nStocks = 0;
      for (var i = 0; i < data[exchange_].listed_companies.length; i++) {
        nStocks++
        setTickerToExchange(state => ({...state, [nameToTicker[data[exchange_].listed_companies[i]]]:  exchange_}))
      }
      const init_data = {
        buyVolume: 0,
        sellVolume: 0,
        nStocks: nStocks
      }
      setExchange(state => ({...state, [exchange_]:  init_data}))
    })
    setTotalVolume(() => 0)
    setExchangeInit(true)
    //exchangeSocket.disconnect()
    
  })

}, [])


useEffect(() => {

  socket.on('UPDATE', current => {
    console.log('******')
    var data = {
      time: current.time,
      value: current.value
    }
    setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), data]}))
  });

}, [stockInit, exchangeInit]);



useEffect(() => {
socket.on('BUY', current => { 
  setBuy(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current]}))
});
}, []);

useEffect(() => {
  socket.on('SELL', current => { 
    setSell(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current]}))
  });
}, []);


useEffect(() => {
  if (stock && exchange) {
    console.log('  -  -  -  -  - BUY -  -  -  -  -  ');
    var volume_ = {};
    var i = 0;
    const keys = Object.keys(buy)

      //console.log(exchange)


  for (i=0; i < keys.length; i++) {
    if (exchange[tickerToExchange[keys[i]]]) {
      console.log('  ')
      console.log('  modify', tickerToExchange[keys[i]])
        var n = 0;
        var addBuy = 0;
        //console.log('     ',buy[keys[i]].length, buy[keys[i]])

        for (n=0; n < buy[keys[i]].length; n++) {
          addBuy += buy[keys[i]][n].volume
          console.log('    sum', addBuy)

          if (volume_[tickerToExchange[keys[i]]]) {
            //console.log('      inside if')
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  addBuy + exchange[tickerToExchange[keys[i]]].buyVolume,
              sellVolume: exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }
          else {
            //console.log('      inside else')
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  addBuy,
              sellVolume: exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }
        console.log('        new volume', volume_)
        console.log('  ')

        }          
      }
    }
    console.log('volume:', volume_)
    console.log('exchange', exchange)
    console.log('  ')
    setExchange(() => volume_)
  }
  
}, [buy]) ;


useEffect(() => {
  if (stock && exchange) {
    console.log('  -  -  -  -  - SELL -  -  -  -  -  ');
    var volume_ = {};
    var i = 0;
    const keys = Object.keys(buy)

      //console.log(exchange)


  for (i=0; i < keys.length; i++) {
    if (exchange[tickerToExchange[keys[i]]]) {
        var n = 0;
        var addSell = 0;

        for (n=0; n < buy[keys[i]].length; n++) {
          addSell += buy[keys[i]][n].volume

          if (volume_[tickerToExchange[keys[i]]]) {
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  exchange[tickerToExchange[keys[i]]].buyVolume,
              sellVolume: addSell + exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }
          else {
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  exchange[tickerToExchange[keys[i]]].buyVolume,
              sellVolume: addSell,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }


        }          
      }
    }

    setExchange(() => volume_)
  }
  
}, [sell]) ;

  if (exchange) {
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
        <Exchange exchange={exchange} totalVolume={totalVolume}/>
          
        {stockCompanies.map((company) => (
          <div className="chart"> 
          <h1 className="title"> {company.ticker} </h1>
            <div> 
              <ChartStock key={company.ticker} data={stock[company.ticker]} />
            </div>
          </div>
          ) )     
        }
      </div>
    );
  }
  else {
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

        {stockCompanies.map((company) => (
          <div className="chart"> 
          <h1 className="title"> {company.ticker} </h1>
            <div> 
              <ChartStock key={company.ticker} data={stock[company.ticker]} />
            </div>
          </div>
          ) )     
        }
      </div>
    );
  }
  
};

ReactDOM.render(<App />, document.getElementById('root'));


