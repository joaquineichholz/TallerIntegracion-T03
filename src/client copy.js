import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import './css/navbar.css'


import Disconnect from './components/disconnect';
import Connect from './components/connect';

import ChartStock from './components/ChartStock';

const protocolo = "wss://";
const servidor = "le-18262636.bitzonte.com";
const ruta = "/stocks";

const socket = io(protocolo + servidor , {
  path: ruta
  });


const App = ({}) => {
  
  const [StockCompanies, setStockCompanies] = useState([]);
  const [Stock, setstock] = useState({});
  const [Disconnect, setDisconnect] = useState();
  const [Connect, setConnect] = useState();
  const [Exchange, setExchange] = useState();
  const [TotalVolume, setTotalVolume] = useState(0.00001)

  

 useEffect(() => {
  socket.on('UPDATE', current => {

    var data = {
      time: current.time,
      value: current.value
    }
    setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), data]}))
  });

  

  socket.emit('STOCKS', () => {
  } )
  socket.on('STOCKS', data => {    
    // agrego las empresas a StockCompanies  
    for (var i = 0; i < data.length; i++) {
      setStockCompanies(currentData => [...currentData, data[i]])
    }
  });

}, [])

  // 2. render the line chart using the state
  return (
    <div>
            <ul className="nav-ul">
          <li className="nav-li"> <Disconnect disconnect={
             () => {
              setDisconnect(socket.disconnect())
              }} />  
          </li>

          <li className="nav-li"> <Connect connect={
             () => {
              setConnect(socket.connect())
              }} />  
          </li>

      </ul>

      <Exchange exchange={Exchange} totalVolumen={TotalVolume}/>

      {StockCompanies.map((company) => (
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
};

ReactDOM.render(<App />, document.getElementById('root'));


