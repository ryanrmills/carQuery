var carMake = document.getElementById('car-make-input');
//var fuelType = document.getElementsByName('fuel-type');
var fuelType2 = document.getElementsByName('fuelType');
var fuelEco = document.getElementById('fuel-economy');
var driveline = document.getElementById('driveline');
//var transmission = document.getElementsByName('transmission');
var transmission2 = document.getElementsByName('transmission2');
var output = document.getElementById('output');
var formDiv = document.getElementById('form-div');
var button = document.getElementById('submit-btn');

var chosenFuel;

for (let k = 0; k < fuelType2.length; k++){
  fuelType2[k].onmouseover = () => {
    fuelType2[k].className = "fuel-type-2-mouse"
  }

  fuelType2[k].onmouseout = () => {
    fuelType2[k].className = "fuel-type-2";
  }

  fuelType2[k].onclick = () => {
    fuelType2[k].className = 'fuel-type-2-chosen'
    chosenFuel = fuelType2[k].alt;
  }
}

var chosenTrans;

for (let l = 0; l < transmission2.length; l++ ){
  transmission2[l].onmouseover = () => {
    transmission2[l].className = "trans2-mouse";
  }

  transmission2[l].onmouseout = () => {
    transmission2[l].className = "trans2";
  }

  transmission2[l].onclick = () => {
    transmission2[l].className = "trans2-chosen";
    chosenTrans = transmission2[l].alt;
  }
}


button.onclick = submitFunc;

function checkForm(makeVal, fuelEcoVal, drivelineVal, chosenFuel, chosenTrans){
  isValid = true;
  if (makeVal == ""){
    document.getElementById('car-make-err').style.display = "block";
    isValid = false;
  }

  if (fuelEcoVal == ""){
    document.getElementById('fuel-eco-err').style.display = "block";
    isValid = false;
  }

  if (drivelineVal == "none"){
    document.getElementById('driveline-err').style.display = "block";
    isValid = false;
  }
  
  if (chosenFuel == undefined){
    document.getElementById('fuel-type-err').style.display = "block";
    isValid = false;
  }

  if (chosenTrans == undefined){
    document.getElementById('trans2-err').style.display = "block";
    isValid = false;
  }

  return isValid;
}

function submitFunc(){
  let makeVal = carMake.value;
  let fuelEcoVal = fuelEco.value;
  let drivelineVal = driveline.value;
  
  checkForm(makeVal, fuelEcoVal, drivelineVal, chosenFuel, chosenTrans);

  output.innerHTML = "";
  output.style.display = "flex";

  let results = false;
  let numResult = 0;

  output.innerHTML += `
    <div>
      <h4 style="margin: 0px;">Query parameters:</h4>
      <ul style="list-style: none; margin: 0px;">
        <li>Car make: ${makeVal}</li>
        <li>Fuel type: ${chosenFuel}</li>
        <li>Fuel economy: ${fuelEcoVal} mpg</li>
        <li>driveline: ${drivelineVal}</li>
        <li>transmission: ${chosenTrans}</li>
      </ul>
    </div>
  `

  $.getJSON("cars.json", (result) => {
    $.each(result, (index, car) => {
      if (
        makeVal.toLowerCase() == car.Identification.Make.toLowerCase() &&
        chosenFuel == car["Fuel Information"]["Fuel Type"] &&
        fuelEcoVal <= car["Fuel Information"]["Highway mpg"] &&
        drivelineVal == car["Engine Information"].Driveline &&
        chosenTrans == car.Identification.Classification &&
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