// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");
const bodyParser = require('body-parser');

let currentDate = {
    year: 2022,
    month: 04
}
// Code in this section sets up an express pipeline
app.post("/query/postDate", (req, res) =>{
  console.log("'/postDate': sending Response");
  console.log("Post request body", req.body);
  currentDate.year = req.body.year;
  currentDate.month = req.body.month;
  return res.send('recieved POST'); 
});

// three different schools to look up
const stations = [
  "SHA", "ORO", "CLE", "NML", "LUS", "DNP", "BER"  
];
//Station Ids: SHA, ORO, CLE, NML, LUS, DNP, BER 

app.get("/query/getData", async function(request, response, next) {
  //this line is not printing, request is nor coming in?
  console.log("getting data from CDEC...");

  let year = currentDate.year;
  let month = currentDate.month;
   // return an array of results
  waterData = [];
  // get water level for every station
  for (let i = 0; i < stations.length; i++){
    let data = await getData(stations[i], year, month);
    waterData.push(data);
  }

  console.log(waterData);
    
  response.json(waterData);
});


//get data from CDEC
async function getData(station,year,month) {

  date = year + '-' + month + '-01';
  const api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${station}&SensorNums=15&dur_code=M&Start=${date}&End=${date}`;

  console.log(api_url);
  
  let fetch_response = await fetch(api_url);
  let apiData = {"stationId":"SHA","durCode":"M","SENSOR_NUM":15,"sensorType":"STORAGE","date":"2022-1-1 00:00","obsDate":"2022-1-1 00:00","value":1621440,"dataFlag":" ","units":"AF"};
  // apiData = await fetch_response.json();
  // apiData = apiData.results[0];

  let stationId = apiData['stationId'];
  let waterLevel = apiData['value'];
  
  return{
    station: stationId,
    waterLevel: waterLevel
  };

}

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

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
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
