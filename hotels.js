import { consultaHoteles } from "./export.js";
const aparicion = await consultaHoteles();
const data = await aparicion.json();
console.log(data);
let filteredData=data
function precio(numero) {
    return "$".repeat(numero);
}

function symbolToNumber(texto){
    return texto.split("$").length -1
}
const containerTarjetas = document.getElementById("container-tarjetas");

async function hoteles(data) {
    data.forEach((hotels) => {
    const contenido = document.createElement("div");
    contenido.className = "tarjeta";
    containerTarjetas.appendChild(contenido);

    const imgHoteles = document.createElement("img");
    imgHoteles.setAttribute("src", hotels.photo);
    imgHoteles.setAttribute("alt", hotels.name);
    imgHoteles.className = "imgHoteles";
    contenido.appendChild(imgHoteles);

    const nombreHoteles = document.createElement("h2");
    nombreHoteles.className = "name-hotel";
    nombreHoteles.innerText = hotels.name;
    contenido.appendChild(nombreHoteles);

    //Aqui cree el div contenedor
    const divMayor = document.createElement("div");
    divMayor.className = "div-mayor";
    contenido.appendChild(divMayor);

    const sectionCont = document.createElement("section");
    sectionCont.className = "section-cont";
    divMayor.appendChild(sectionCont);

    const button = document.createElement("button");
    button.className = "boton";
    button.innerText= "Book it"
    divMayor.appendChild(button);

    const divCont = document.createElement("div");
    divCont.className = "div-contenedor";
    sectionCont.appendChild(divCont);

    //Aqui cree los div menores
    const div1 = document.createElement("div");
    div1.className = "div-1";
    divCont.appendChild(div1);

    const div2 = document.createElement("div");
    div2.className = "div-2";
    divCont.appendChild(div2);

    const imgHoteles2 = document.createElement("img");
    imgHoteles2.setAttribute("src", `./recursos/${hotels.country}-flags.png`);
    imgHoteles2.setAttribute("alt", hotels.country);
    imgHoteles2.className = "imgHoteles";
    div1.appendChild(imgHoteles2);

    const pais = document.createElement("p");
    pais.className = "p";
    pais.innerText = hotels.country;
    div1.appendChild(pais);

    const description = document.createElement("p");
    description.className = "p";
    description.innerText = `rooms ${hotels.rooms}-`;
    div2.appendChild(description);

    const description2 = document.createElement("p");
    description2.className = "p";
    description2.innerText = precio(hotels.price);
    div2.appendChild(description2);
    });
}
/*hoteles(data);
const filtro = document.getElementById("filter-prices");
filtro.addEventListener("change", () => {
    let valor = filtro.value;
    
    let optionIndex= filtro.options[filtro.selectedIndex];
    
    let contenidoIndex=optionIndex.textContent;
    
    let change= isa(contenidoIndex)
    
    let save= data

    if (valor != "all"){
        save=data.filter((hotels)=>hotels.price==change)
    }
    containerTarjetas.innerHTML=""
    hoteles(save)
});
const clear=document.getElementById("input")
clear.addEventListener("click",()=>{
    filtro.selectedIndex=0
    containerTarjetas.innerHTML=""
    hoteles(data)
} )*/
let shouldShowMessage = false;
function applyFilters() {
  let tempData = data;
  // Apply price filter
  const selectedPrice = filterPrices.value;
  let priceSelect = filterPrices.options[filterPrices.selectedIndex];
  const textPreiceSelected = priceSelect.textContent;
  const changeToNumber = symbolToNumber(textPreiceSelected);
  if (selectedPrice != "all") {
    tempData = tempData.filter((hotel) => hotel.price == changeToNumber);
  }
  // Apply date filter
  if (dateCheckOutSelected) {
    const differenceInMilliseconds = calculateDifferenceDays();
    tempData = tempData.filter((hotel) =>
      isHotelAvailable(hotel, differenceInMilliseconds)
    );
  }
  filteredData = tempData;
  shouldShowMessage = filteredData.length > 0;
  const messageContainer = document.getElementById("message-container");
  if (filteredData.length == 0) {
    messageContainer.textContent = "Sorry we don't have hotels available";
  }
}

hoteles(data);

// FILTER PRICES
const filterPrices = document.getElementById("filter-prices");
filterPrices.addEventListener("change", () => {
  applyFilters();
  containerTarjetas.innerHTML=""
  hoteles(filteredData);
});
// FILTER DATE
const dateCheckIn = document.getElementById("checkIn");
const dateCheckOut = document.getElementById("checkOut");
const today = new Date();
function zerodate(dateZero) {
  const converText = "" + dateZero;
  if (converText.length === 1) {
    return "0" + dateZero;
  } else {
    return dateZero;
  }
}
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const dateCheckInHotels = year + "-" + zerodate(month) + "-" + zerodate(day);
const dateCheckOutHotels =
  year + "-" + zerodate(month) + "-" + zerodate(day + 1);
dateCheckIn.setAttribute("min", dateCheckInHotels);
dateCheckOut.setAttribute("min", dateCheckOutHotels);
dateCheckIn.addEventListener("change", () => {
  const parts = dateCheckIn.value.split("-");
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  const finalDate = year + "-" + zerodate(month) + "-" + zerodate(day + 1);
  dateCheckOut.setAttribute("min", finalDate);
  dateCheckOutSelected = false;
  applyFilters();
  containerTarjetas.innerHTML=""
  hoteles(filteredData);
});
function isHotelAvailable(hotel, differenceInMilliseconds) {
  const availabilityFrom = hotel.availabilityFrom;
  const availabilityTo = hotel.availabilityTo;
  const availabilityDifference = availabilityTo - availabilityFrom;
  return availabilityDifference >= differenceInMilliseconds;
}
let dateCheckOutSelected = false;
function calculateDifferenceDays() {
  const currentDateIni = new Date();
  currentDateIni.setHours(0, 0, 0, 0);
  const optionCheckInIni = new Date(dateCheckIn.value + " 00:00:00");
  optionCheckInIni.setHours(0, 0, 0, 0);
  const optionCheckIn = optionCheckInIni.getTime();
  if (dateCheckOut.value == "") {
    return;
  }
  const optionCheckOut = new Date(dateCheckOut.value);
  const millisecondsDate = optionCheckOut - optionCheckIn;
  const millisecondsInADay = 24 * 60 * 60 * 1000; // 86,400,000
  return Math.round(millisecondsDate / millisecondsInADay) * millisecondsInADay;
}
dateCheckIn.value = "";
dateCheckOut.value = "";
dateCheckOut.addEventListener("change", () => {
  dateCheckOutSelected = true;
  applyFilters();
  containerTarjetas.innerHTML=""
  hoteles(filteredData);
});
const clear=document.getElementById("input")
clear.addEventListener("click",()=>{
    containerTarjetas.innerHTML=""
    hoteles(data)
} )

