import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import './css/navbar.css'


import Disconnect from './components/disconnect';
import Connect from './components/connect';

import Exchange from './components/Exchange';
import InfoStock from './components/Stock';
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

  const [newStock, setNewStock] = useState({})
  
  const [high, setHigh] = useState(0);
  const [low, setLow] = useState(999999999);
  const [lastValue, setLastValue] = useState(1);
  const [deltaValue, setDeltaValue] = useState(0)
  const [totalVolume, setTotalVolume] = useState(0.00001);

  const [infoValueStock, setInfoValueStock] = useState({})

  const [stockInit, setStockInit] = useState(false);
  const [exchangeInit, setExchangeInit] = useState(false);


  const [disconnect, setdisconnect] = useState();
  const [connect, setconnect] = useState();

  const [exchange, setExchange] = useState({});
  const [buy, setBuy] = useState({})
  const [sell, setSell] = useState({})


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
    //setTotalVolume(() => 0)
    setExchangeInit(true)
    //exchangeSocket.disconnect()
    
  })

}, [])


//useEffect(() => {
  const run = () => {
  socket.on('UPDATE', current => {
    var chart = {
      time: current.time,
      value: current.value
    }
    setHigh(state => ({...state, [current.ticker]: Math.max(state[current.ticker], current.value)}))

    setLow(state =>  ({...state, [current.ticker]: Math.min(state[current.ticker], current.value)}));

    setDeltaValue(state => (lastValue - current.value) / lastValue);
    setLastValue(state => current.value);
    setInfoValueStock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), current.value]}))

    setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), chart]}))
    /*setInfoStock(state => ({...state, [current.ticker]: {
      totalVolume: state.totalVolume,
      high: Math.max(current.value, state[current.ticker].high),
      low: Math.min(current.value, state[current.ticker].low),
      lastValue: current.value,
      deltaValue: (state[current.ticker].value - current.value) / state[current.ticker].value         
    }}))*/
  });
}
//}, [stockInit, exchangeInit]);


useEffect(() => {
  const keys = Object.keys(infoValueStock)
  var i = 0;
  for (i=0; i < keys.length; i++) {
    var values = infoValueStock[keys[i]];
    var minValue = Math.min(...values);
    var maxValue = Math.max(...values);
    var lastValue = 0;

    if (values.length > 0) {
      lastValue = values[values.length - 1];
    }
    var deltaValue = 0 ;

    if (values.length > 1) {
      deltaValue = (values[values.length - 2] - values[values.length - 1]) / values[values.length - 2]  ;
    } 

 
    console.log('keys[i],', keys[i])
    setNewStock(state => ({[keys[i]]:  {
                                          totalVolume: state.totalVolume,
                                          high: maxValue,
                                          low: minValue,
                                          lastValue: lastValue,
                                          deltaValue: deltaValue      
                                        }
                          })
                ) 

  }
}, [infoValueStock])

console.log('   ')
console.log(' --- client ---')
console.log(newStock)

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
  if (stockCompanies && exchange) {
    var volume_ = {};
    var i = 0;
    const keys = Object.keys(buy)

      //console.log(exchange)


  for (i=0; i < keys.length; i++) {
    if (exchange[tickerToExchange[keys[i]]]) {
        var n = 0;
        var addBuy = 0;

        for (n=0; n < buy[keys[i]].length; n++) {
          addBuy += buy[keys[i]][n].volume

          if (volume_[tickerToExchange[keys[i]]]) {
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  addBuy + exchange[tickerToExchange[keys[i]]].buyVolume,
              sellVolume: exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }
          else {
              volume_[tickerToExchange[keys[i]]] = {
              buyVolume:  addBuy,
              sellVolume: exchange[tickerToExchange[keys[i]]].sellVolume,
              nStocks: exchange[tickerToExchange[keys[i]]].nStocks
              }
          }
        }          
      }
    }
    setExchange(() => volume_)
  }
  
}, [buy]) ;


useEffect(() => {
  if (stock && exchange) {
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

        <InfoStock newStock={newStock}/>
        
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


