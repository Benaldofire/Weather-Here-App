

//set up the map and plot points on the
function mapSetup(){
    let mymap = L.map('ISSMap').setView([0, 0], 1);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYmVuYWxkb2ZpcmUiLCJhIjoiY2tyb2p3MzRwMXl1eTJvb2JwYTAxYjUzbSJ9.jwVuv6e3JKs_xemAzgXMIg'
    }).addTo(mymap);

    let firstTime = true;

    //get current data and plot the locations on the map.
    async function getdata(){
        const response = await fetch("/api");
        const data = await response.json();
        console.log(data);

        
        const latitude = data[0].latitude; 
        const longitude = data[0].longitude;

        //place marker using the latitude and longitude from the API

        if(firstTime){ //to avoid your zoom reseting
            mymap.setView([latitude, longitude], 2);
            firstTime = false;
        }

        //add all points to the map, with their description
        for(point of data){
            L.marker([point.latitude, point.longitude]).addTo(mymap).bindPopup(point.Weather_Description).openPopup();
        }
    }

    document.querySelector("#checkin").addEventListener("click",getdata);
    
    getdata().catch(error => {
        console.log(error);
    });

}

mapSetup();



