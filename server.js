const express = require("express");
const app = express();
const Datastore = require('nedb'); //database in use
const fetch = require('node-fetch');
require('dotenv').config();

app.use(express.static("public"));
app.use(express.json({limit: '1mb'}));
app.listen(3000, ()=> console.log("Listening on port 3000"));

//create database
const database = new Datastore("database.db");
database.loadDatabase();


//Route to get geolocation data and store into database
app.post('/api',function(req, res){
    //console.log(req.body);

    let data = req.body;
    
    //future work - Only add new updated data to the database. 
    database.insert(data);


    res.json({
        status: "successful",
        Datareceived: data
    })
})

//route to return database data to client
app.get('/api', (request, response)=>{
    //Model.find(conditions, [callback])
    database.find({},(error,data) =>{
        if(error){
            response.end();
            return;
        }
        response.json(data);
    });

})

//route for the weather. Makes request on the webserver to the weather API and returns to the client.
//stores data to the database before sending.
app.get('/weather/:latitude/:longitude', async function(request, response){
    const latitude = request.params.latitude;
    const longitude = request.params.longitude;
    const units = "imperial"

    const API_KEY = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`

    //fetch the current weather data
    const Weather_response = await fetch(weather_url);
    const weather_data = await Weather_response.json();

    response.json(weather_data); //send json data from fetch request as the response to the client

})


//remove all documents in the database
app.get('/remove', (request, response)=>{
    //Model.find(conditions, [callback])
    database.remove({},{ multi: true },(error,data) =>{
        if(error){
            console.log("Removed")
            return;
        }
        response.json(data);
    });

})
