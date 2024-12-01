var carMake = document.getElementById('car-make-input');
var fuelType = document.getElementsByName('fuel-type');
var fuelEco = document.getElementById('fuel-economy');
var driveline = document.getElementById('driveline');
var transmission = document.getElementsByName('transmission');
var output = document.getElementById('output');
var formDiv = document.getElementById('form-div');
var button = document.getElementById('submit-btn');

button.onclick = submitFunc;

function submitFunc(){
  let makeVal = carMake.value;
  let fuel = "";
  let fuelEcoVal = fuelEco.value;
  let drivelineVal = driveline.value;
  let transVal = "";

  for (let i in fuelType){
    if (fuelType[i].checked){
      fuel = fuelType[i].value;
      break;
    }
  }

  for (let j in transmission){
    if (transmission[j].checked){
      transVal = transmission[j].value;
      break;
    }
  }
  
  output.innerHTML = "";
  output.style.display = "flex";

  let results = false;
  let numResult = 0;

  output.innerHTML += `
    <div>
      <h4 style="margin: 0px;">Query parameters:</h4>
      <ul style="list-style: none; margin: 0px;">
        <li>Car make: ${makeVal}</li>
        <li>Fuel type: ${fuel}</li>
        <li>Fuel economy: ${fuelEcoVal}</li>
        <li>driveline: ${drivelineVal}</li>
        <li>transmission: ${transVal}</li>
      </ul>
    </div>
  `

  $.getJSON("cars.json", (result) => {
    $.each(result, (index, car) => {
      if (
        makeVal.toLowerCase() == car.Identification.Make.toLowerCase() &&
        fuel == car["Fuel Information"]["Fuel Type"] &&
        fuelEcoVal <= car["Fuel Information"]["Highway mpg"] &&
        drivelineVal == car["Engine Information"].Driveline &&
        transVal == car.Identification.Classification &&
        numResult < 20
      ){
        results = true;
        numResult++;
        console.log("numResult:", numResult);

        output.innerHTML += "<h3 style='margin: 0px; padding: 0px; margin-top: 1em; margin-bottom: 0.5em;'>" + car.Identification.ID + "</h3>";
        output.innerHTML += "<p style='margin: 0px; padding: 0px'>MPG(city/hwy): " + car["Fuel Information"]["City mpg"] + "/" + car["Fuel Information"]["Highway mpg"] + " mpg</p>";
        output.innerHTML += "<p style='margin: 0px; padding: 0px'>Fuel type: " + car["Fuel Information"]["Fuel Type"] + "</p>";
        output.innerHTML += "<p style='margin: 0px; padding: 0px'>Driveline: " + car["Engine Information"].Driveline + "</p>";
        output.innerHTML += "<p style='margin: 0px; padding: 0px'>Transmission: " + car.Identification.Classification;
        output.innerHTML += "<p style='margin: 0px; padding: 0px'>Horsepower/Torque: " + car["Engine Information"]["Engine Statistics"].Horsepower + "/" + car["Engine Information"]["Engine Statistics"].Torque + "</p>" 
      }

    })

    if (results === false){
      output.innerHTML += "<p style='margin: 1em 0em;'>No results found.</p>"
    }
  })
}