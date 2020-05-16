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

const exchangeSocket = io(protocolo + servidor , {
  path: ruta
  });

const stockSocket = io(protocolo + servidor , {
  path: ruta
  });
  
  
  


const App = ({}) => {
  
  const [stockCompanies, setstockCompanies] = useState([]);
  const [stock, setstock] = useState({});
  const [infoStock, setInfoStock] = useState({})

  const [stockInit, setStockInit] = useState(false);
  const [exchangeInit, setExchangeInit] = useState(false);
  const [exchange, setExchange] = useState({});

  const [disconnect, setdisconnect] = useState();
  const [connect, setconnect] = useState();

  const [buy, setBuy] = useState({})
  const [sell, setSell] = useState({})
  const [volumeBuyByStock, setVolumeBuyByStock] = useState({})


  //const [nameToTicker, setNameToTicker] = useState({});
  const [tickerToExchange, setTickerToExchange] = useState({})  


 useEffect(() => {
   const nameToTicker = {};

  stockSocket.emit('STOCKS', () => {
  })
  

  stockSocket.on('STOCKS', data => {   
    // agrego las empresas a StockCompanies  
    for (var i = 0; i < data.length; i++) {
      setstockCompanies(currentData => [...currentData, data[i]])
      setInfoStock(state => ({...state, [ data[i].ticker]:  
                    {
                      totalVolume: 0,
                      high: 0,
                      low: 99999999999,
                      lastValue: 0,
                      deltaValue: 0        
                    }
                  })) 
      nameToTicker[data[i].company_name] = data[i].ticker
      
    }
    setStockInit(true);
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
    setExchangeInit(true)
    
  })

}, [])


useEffect(() => {
  socket.on('UPDATE', current => {
    var chart = {
      time: current.time,
      value: current.value
    }
    setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), chart]}))

  });

}, [stockInit, exchangeInit]);

useEffect(() => {
socket.on('BUY', current => { 
  setBuy(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current.volume]}))
});
}, []);

useEffect(() => {
  socket.on('SELL', current => { 
    setSell(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current]}))
  });
}, []);


useEffect(() => {
  if (stockCompanies && exchange) {
    var volume_ = exchange;
    var i = 0;
    const keys = Object.keys(buy)


  for (i=0; i < keys.length; i++) {
    if (exchange[tickerToExchange[keys[i]]]) {
        
        var buyList = buy[keys[i]];
        var name = keys[i];

        //for (n=0; n < buy[keys[i]].length; n++) {
            //setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), chart]}))
            //  console.log(keys[i],buy[keys[i]])
            //addBuy += ticker            
        console.log(name, buyList)
        setVolumeBuyByStock( state => ({...state, [name]: [...(state[name] || []), ...buyList]}) )

        volume_[tickerToExchange[name]] = {
          buyVolume: buyList.reduce(function(acc, val) { return acc + val; }, 0) + exchange[tickerToExchange[name]].buyVolume,
          sellVolume: exchange[tickerToExchange[name]].sellVolume,
          nStocks: exchange[tickerToExchange[name]].nStocks
          }
      }

}

setExchange(() => volume_)
}

}, [buy]) ;


console.log('- - - - - ')
console.log(exchange)
console.log('- - - - - ')

useEffect(() => {
  if (stock && exchange) {
    var volume_ = {};
    var i = 0;
    const keys = Object.keys(buy)

  for (i=0; i < keys.length; i++) {
    if (exchange[tickerToExchange[keys[i]]]) {
        
        var sellList = buy[keys[i]]
          
      
        volume_[tickerToExchange[keys[i]]] = {
              buyVolume: exchange[tickerToExchange[keys[i]]].buyVolume, 
              sellVolume: sellList.reduce(function(acc, val) { return acc + val; }, 0) + 
                                                      exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }

    }

    setExchange(() => volume_)
  }

}, [sell]) ;

  if (exchange && infoStock) {
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
        <Exchange exchange={exchange}/>

        <Stock volumeBuyByStock={volumeBuyByStock}/>
        
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


