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

    // hooks runs only when state changes occur
    useEffect(() => {
      // we dont make api call when we have a state already selected on first render
    if (!first.current) {
      console.log('returning on first render')
      return;
    }
    //create msg object, using which we subscribe to the pair of currency we selected
    //also stores ticker data for the web hooks
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    // convert javascript object to json
    let jsonMsg = JSON.stringify(msg);
    // send that data using web socket in form of json
    ws.current.send(jsonMsg);

    // to fetch historical data of the current selected pair
    // granularity set to 86400 seconds which gives daily price chart
    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    // fetches historical data
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
        console.log(dataArr);

      // after getting data in form of json format data and , set state using the hook setpastData
      // format data function to be implemented
      setpastData(dataArr);
    };


    // call the function
    fetchHistoricalData();
    // every time price of currency updates on coinbase, a message is received through the websocket

    ws.current.onmessage = (e) => {
      // convert to javascript object, check type of event is ticker event, if not then return
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        console.log('non ticker event',e);
        return;
      }
      // if ticker event, and matches with product id of the currently selected pair, update the price using setprice hook
      if (data.product_id === pair) {
        console.log('id is matched');
        setprice(data.price);
      }
    };
  }, [pair]); 
  
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
