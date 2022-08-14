import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';



function App() {
 
  //all available cryptocurrencies
  const [currencies, setcurrencies] = useState([]);
  // current currency user chose
  const [pair, setpair] = useState("");
  // price of that currency
  const [price, setprice] = useState("0.00");
  // past history of that crypto currency
  const [pastData, setpastData] = useState({});
  // websocket reference , so that websocket object is persistent and doesnt get recreated with every render
  const ws = useRef(null);

  // to prevent api call on first rendering of the component
  let first = useRef(false);
  // we use coinbase api to get realtime data, base url to make api calls
  const url = "https://api.pro.coinbase.com";

  // first hook which only runs when the component is rendered first time
  useEffect(() => {
    // create a websocket connection with coinbase using websocket reference object
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    // array for currency pairs
    let pairs = [];
    // async function which fetchs data from https://api.pro.coinbase.com/products
    // and store it in pairs array.
    const apiCall = async () => { 
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));
      // fetch only those currencies which are paired with US dollars
      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "USD") {
          return pair;
        }
      });
      // sort currencies alphabetically
      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
      console.log(filtered);
      // set currencies  to currencies var    
      setcurrencies(filtered);
      // set to true once the initial api call is done, so that api call is not done on every rerender
      first.current = true;
    };

    // call the function to make api call
    apiCall();
    // empty array used for the dependency on useEffect, so that every time state gets updated, hook doesnt rerun. avoiding infinite loop
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
