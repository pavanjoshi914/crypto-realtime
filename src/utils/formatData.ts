

// to format currency pairs received from coinbase
export const formatData = (data) => {
    // formated data containing labels and dataset. formating data to display on chart
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          //backgroundColor: "linear-gradient(red, yellow)",
          borderColor: "rgba(255, 156, 0, 0.5)",
          fill: true,
        }
      ]
    };
  // format date data coming from coinbase in month, year , date , day
  console.log(data);
    let dates = data?.map((val) => {
      const ts = val[0];
      let date = new Date(ts * 1000);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let final = `${month}-${day}-${year}`;
      return final;
    });

  // grabs number values for price high , price low etc
    let priceArr = data?.map((val) => {
      return val[4];
    });

    //reverse both arrays
    priceArr.reverse();
    dates.reverse();
    // add data to the final data sets
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;

    // return final data
    return finalData;
  }; 
