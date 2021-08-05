//get data and display it in the total "check-ins" page
async function getData(){
    let response = await fetch('/api');
    let data = await response.json();
    console.log(data);
    const mainContainer = document.querySelector("#data-container");
    for(item of data){
        const entryContainer = document.createElement('div');
        const description = document.createElement('div');
        const date = document.createElement('div');
        //console.log(item);

        description.textContent = `The weather at ${item.latitude.toFixed(2)}, ${item.longitude.toFixed(2)} is ${item.weather_data.current.weather[0].description}.
        Temperature is ${item.weather_data.current.temp}° Fahrenheit .`;
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = dateString;

        entryContainer.append(description, date);
        mainContainer.append(entryContainer);

        //ADD CLASS to main container 
        entryContainer.classList.add('entry');
    }
    
    //console.log(data);
}

getData().catch((error)=>{
    console.log(error);
});

async function removeData(){
    let response = await fetch('/remove');
    let data = await response.json();
    console.log(data);
    console.log("Data removed")
    console.log(data);

    const mainContainer = document.querySelector("#data-container");
    mainContainer.innerHTML = "<h1>All Deleted</h1>"
    
}

document.querySelector("#remove_all").addEventListener('click',removeData);

