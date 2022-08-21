import { useEffect, useRef, useState } from 'react';
import './App.css';
import { formatData } from './utils/formatData';
import Dashboard from "./components/Dashboard";
import "./styles.css";
import { requestProvider } from './utils/webln/client';
import  {ExportMetadata}   from "./assets/hashes/JSONConstructor"
import {requestInvoice} from './lnurl-pay/request-invoice';
import { Satoshis } from './lnurl-pay/types';

const enum WebSocketReadyState {
  /** The connection is not yet open. */
  CONNECTING = 0,
  /** The connection is open and ready to communicate. */
  OPEN = 1,
  /** The connection is in the process of closing. */
  CLOSING = 2,
  /** The connection is closed or couldn't be opened. */
  CLOSED = 3,
}

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
  const [showSelect, setshowSelect] = useState(false);
    
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
    ws.current.readyState === WebSocketReadyState.OPEN && ws.current.send(jsonMsg);

    // to fetch historical data of the current selected pair
    // granularity set to 86400 seconds which gives daily price chart
    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    // fetches historical data
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => {
          dataArr = data;
          // after getting data in form of json format data and , set state using the hook setpastData
      // format data function to be implemented - done
      // keep this in callback function so that array is not passed as undefined to format data function and map not defined error is cured
      console.log(dataArr);
      let formattedData =  formatData(dataArr);
      setpastData(formattedData);
          
    
        });
        console.log(dataArr);
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

  // to subscribe to new currency-pair
  const handleSelect = (e) => {
    // unsubscribe to the previous currency pair which was subscribed by the user
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);
    // send msg to coinbase
    // wait till connection is created by the websocket then execute it
    ws.current.onopen = () => ws.current.readyState === WebSocketReadyState.OPEN &&  ws.current.send(unsub);
    // subscribe to new currency pair
    setpair(e.target.value);
  };

  useEffect(()=>{

    if(ws.current.readyState!= WebSocketReadyState.OPEN){
      setshowSelect(true);
    }
  })


  async function pay(song: object) {
    const tokenvalue: Satoshis = 10 as Satoshis;
    const { invoice } =
    await requestInvoice({
      lnUrlOrAddress: "pavanj@getalby.com",
      tokens: tokenvalue,
      comment: "Buy Song",
    });
  
  
    type ObjectKey = keyof typeof song;
  
  const songSrc: string = song['src' as ObjectKey];
  
    console.log(song);
  
    const webln = await requestProvider();
    console.log(webln);
    if(!webln) {
      return;
    }
    requestProvider()
        .then(function(webln) {
          // returns weblnProvider object which contains all the methods defined example send payment, execute, verifySignMessage etc etc
          // we will define specification used by lnurl metadata here as well.
          console.log(webln)
  
          console.log(song);
        
          //// Metadata json array which must be presented as raw string here, this is required to pass signature verification at a later step
          /// we need way to convert json array into raw string, decode it on wallet side and then render it.
          //https://github.com/fiatjaf/lnurl-rfc/blob/luds/06.md type of metadata that is also to be decided
  
          // metadata prepared as json format, passed as string
  
          const metadataString =JSON.stringify(ExportMetadata())
  
          console.log(metadataString);
          const timeout = document.getElementById('content') as HTMLDivElement;
          function hideElement() {
            timeout.style.display = 'none'
          }
          return webln.sendPayment(invoice, metadataString)
            .then(function(r) {
              // required this constraint to protect metadata in empty invoices as a rule
              if(r !== undefined){
                const contentDiv = document.getElementById('content') as HTMLDivElement;
              contentDiv.innerHTML = "YAY, thanks!";
              setTimeout(hideElement, 5000) //milliseconds until timeout//
              
            console.log('done', r);
  
              const a = document.createElement('a')
    a.href = songSrc
    a.download = songSrc.split('/').pop() as string
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  
            }
            })
            .catch(function(e) {
              alert("Failed: " + e.message);
              console.log('err pay:', e);
            });
      })
      .catch(function(e) {
        alert("Webln error, check console");
        console.log('err, provider', e);
      });
  }
  

  
  return (
    
        <div className="container" >
      {
        <div className="select">
        {showSelect && <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <optgroup key={idx}>
              <option  value={cur.id}>
                {cur.display_name}
              </option>
              </optgroup>
            );
          })}
        </select>}
        </div>
      }
      <Dashboard price={price} data={pastData} />
      <div><button className="glow-on-hover position-button" onClick={() =>pay({})}>Donate</button></div>
    </div>
      
  );
}

export default App;
