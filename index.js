// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// three different schools to look up
const stations = [
  "Shasta",
  "Ororville", 
  "Trinity Lake",
  "New Melones",
  "San Luis",
  "Don Pedro",
  "Berressa"  
];
//Station Ids: SHA, ORO, CLE, NML, LUS, DNP, BER 

app.get("/query/getData", async function(request, response, next) {
  
  console.log("getting data from CDEC...");

  let year = request.body['year'];
  let month = request.body['month'];
   // return an array of results
  waterData = [];
  // get water level for every station
  for (let i = 0; i < stations.length; i++){
    let data = await getData(stations[i], year, month);
    waterData.push(data);
  }

  response.json(waterData);
});


//get data from CDEC
async function getData(station,year,month) {

  date = year + '-' + month + '-01';
  const api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${station}&SensorNums=15&dur_code=M&Start=${date}&End=${date}`;
  
  let fetch_response = await fetch(api_url);
  let apiData = await fetch_response.json();
  apiData = apiData.results[0];

  let stationId = apiData['stationId'];
  let waterLevel = apiData['value'];
  
  return{
    station: stationId,
    waterLevel: waterLevel
  };

}


// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  req.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
