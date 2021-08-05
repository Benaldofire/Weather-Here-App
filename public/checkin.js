//get the geolocation data
// to avoid spam, put a condition that checks the database if within the last 10min, if the data has already been requested before. Then return it if true.
let data = {} // data to send to database

function getLocation(){
    const lng_Elm = document.querySelector("#longitude");
    const lat_Elm = document.querySelector("#latitude");

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    async function success(position) {
        try{
            var crd = position.coords;
            let longitude = crd.longitude;
            let latitude = crd.latitude;
            let timestamp = position.timestamp;

            lng_Elm.textContent = longitude.toFixed(2); //to fixed is 2 d.p
            lat_Elm.textContent = latitude.toFixed(2);

            

            //fetch the current weather and airquality data from the webserver, include params. 
            //OR, use POST reuqest. send latitude and longitude to the webserver and get weather data
            const weather_response = await fetch(`/weather/${latitude}/${longitude}`);
            const weather_data = await weather_response.json();
            console.log(weather_data);
            
            //put the description in the html dom
            document.querySelector("#temperature").textContent = weather_data.current.temp;;
            document.querySelector("#description").textContent = weather_data.current.weather[0].description;
            
            // get the new complete description and the data and add it to the database.
            let Weather_Description = document.querySelector("#content").textContent;
            data = {timestamp, latitude, longitude, weather_data, Weather_Description};
            
                  
        }
        catch(error){
            document.querySelector("#content").textContent = "Unable to aquire weather data at your location, please try again later"
            console.error(error);
        }
          
    }

    //error handler
    function error(err) {
        status.textContent = " Unable to retrieve your location";
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    //check if browser has geolocation
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
    else{
        status.textContent = "Geolocation is not supported by your browser ";
    }
}

getLocation();

async function checkin(){
    //get current timestamp and location
    getLocation();

    //Postoption for second parameter of a fetch post request, with header data
    postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header, json in this case
    }

    //POST the data to the webserver
    const response = await fetch('/api', postOptions);
    const json = await response.json();
    console.log(json);
}

document.querySelector("#checkin").addEventListener("click",checkin);

