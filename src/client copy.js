import io from 'socket.io-client';
import React from 'react';
import { useEffect, useState } from 'react';



import MainChart from './components/MainChart';
import StockStats from './components/StockStats';

const protocolo = "wss://";
const servidor = "le-18262636.bitzonte.com";
const ruta = "/stocks";

const socket = io(protocolo + servidor , {
  path: ruta
  });


function App() {
  
  const [stockCompanies, setstockCompanies] = useState([]);
  const [stock, setstock] = useState({})
  const [stats, setstats] = useState({})

  const disconnectSocket = () => {
    socket.disconnect()
  }

  const increase = () => {
    console.log(stats)
  }
 
  const startSocket = () => {
    socket.on('UPDATE', current => {

      var data = {
        time: current.time,
        value: current.value
      }
      setstock(state => ({...state, [current.ticker]: [...(state[current.ticker] || []), data]}));
      setstats(state => 
        ({...state, [current.ticker]: {...state[current.ticker], prices : state[current.ticker]['pices'].push(current.value)}}));
    });

    socket.on('BUY', current=> {
      
      setstats(state => 
        ({...state, [current.ticker]: {...state[current.ticker], volumenTransado : state[current.ticker]['volumenTransado']+current.volume}}));
      setstats(state => 
        ({...state, [current.ticker]: {...state[current.ticker], volumenCompra : state[current.ticker]['volumenCompra']+current.volume}}));
    })

    socket.on('SELL', current=> {
      
      setstats(state => 
        ({...state, [current.ticker]: {...state[current.ticker], volumenTransado : state[current.ticker]['volumenTransado']-current.volume}}));
      setstats(state => 
        ({...state, [current.ticker]: {...state[current.ticker], volumenVenta : state[current.ticker]['volumenVenta']+current.volume}}));
    })

  };

 useEffect(() => {
  
  

  socket.emit('STOCKS', () => {
  } )
  socket.on('STOCKS', data => {    
     
    for (var i = 0; i < data.length; i++) {
      let current = data[i]
  
      setstats(state => ({...state, [current.ticker]: {...(state[current.ticker] || {}),  'volumenTransado' : 0, 'altoHistorico' : 0, 'bajoHistorico' : 0,
      'ultimoPrecio' : 0, 
      'variacionPorcentual' : 0, 
      'volumenCompra' : 0, 
      'volumenVenta' : 0, 
      'numeroAcciones' : 0,
      'ticker': current.ticker,
      'participacionMercado' : 0, 
      'pices': []}}));
      setstockCompanies(currentData => [...currentData, data[i]])
    }
  });

}, [])

  var graph = false; 
  if (graph){
  return (
    <div>
      {stockCompanies.map((company) => (
        <div className="chart"> 
        <h1 className="title"> {company.ticker} </h1>
          <div> 
            <MainChart key={company.ticker} data={stock[company.ticker]} />
          </div>
        </div>
        ) )     
      }
    </div>
  );}
  else{
    return(
    <div>
      <button onClick={() => disconnectSocket()}> Desconectar socket</button>
      <button onClick={() => startSocket()}> conectar socket</button>
      <button onClick={() => increase()}> conectar socket</button>
      <div>
        <StockStats data={JSON.stringify(stats)}/>
      </div>
    </div>
    )}

}





export default App;