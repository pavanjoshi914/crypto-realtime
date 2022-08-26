import { Line } from "react-chartjs-2";
import FileSaver from 'file-saver';
// ...
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  } from 'chart.js';

  
import { useCallback, useEffect, useRef, useState } from "react";
import { ExportMetadata, JsonConstructor } from "../assets/hashes/JSONConstructor";
import { requestInvoice } from "../lnurl-pay/request-invoice";
import { requestProvider } from "../utils/webln/client";
import { Satoshis } from "../lnurl-pay/types";
import { hashes } from "../assets/hashes/ImageHashes";
  

  Chart.register(
    
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  );

// renders currency pair chart and price
export function Dashboard({ price, data, currentTargetPair }) {
  const ref = useRef(null);
let image = null;


  
async function pay() {




         
          
        console.log(image);
          JsonConstructor(currentTargetPair, currentTargetPair, `Realtime ${currentTargetPair} volatility Analysis Chart `,240,240,hashes.thumbnail,"https://crypto-realtime.vercel.app/", 
          "https://drive.google.com/uc?authuser=0&id=1aP1AS-Bu2vf2CPuVOfPCyqn3XYnmAp0D&export=download")

  const tokenvalue: Satoshis = 10 as Satoshis;
  const { invoice } =
  await requestInvoice({
    lnUrlOrAddress: "pavanj@getalby.com",
    tokens: tokenvalue,
    comment: "Buy Crypto Analytics Chart",
  });


 

function onTestSaveFile() {
    var blob = new Blob(["Making Payment Transactions Smart With structured Metadata!"], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "hello world.txt");
}



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

     
      
        //// Metadata json array which must be presented as raw string here, this is required to pass signature verification at a later step
        /// we need way to convert json array into raw string, decode it on wallet side and then render it.
        //https://github.com/fiatjaf/lnurl-rfc/blob/luds/06.md type of metadata that is also to be decided

        // metadata prepared as json format, passed as string

        const metadataString =JSON.stringify(ExportMetadata());

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
            
            onTestSaveFile();
          console.log('done', r);

          const link = document.createElement("a");
          link.download="chart.png";
          link.href = ref.current.toBase64Image();
          image = link.href;
          link.click()

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




  
  

  
  // when there is change in data variable i.e data contains original data by coinbased then rerender component
  const [dataNotEmpty, setdataNotEmpty] = useState([]);
 
  // rerender component when value of data is changed
  useEffect(() => {
    if(Object.keys(data).length != 0){
    setdataNotEmpty(data);
    }
  }, [data]);
  // after select tag is used and data fetch is delayed, here data passed contain empty object which creates plugin error
  console.log(data);
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    
    scales: {
        y: {
          ticks: { color: 'white', beginAtZero: true }
        },
        x: {
          ticks: { color: 'white', beginAtZero: true }
        }
    },
      

    responsive: true,
    maintainAspectRatio: false
  };
  if (price === "0.00") {
    return <h2>please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      <h2>{`$${price}`}</h2>

      <div className="chart-container">
      
     {// if data is not empty then only render plugin code, to avoid error
     Object.keys(dataNotEmpty).length != 0 && <><Line ref={ref}  id='canvas' data={data} options={opts} />
      <div><button className="glow-on-hover position-button" onClick={() =>pay()}>Download Analytics Chart</button></div>
      <div id="content"></div>
      </>
      }

      </div>
    </div>
  );
}

export default Dashboard;