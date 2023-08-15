import { consultaHoteles } from "./export.js";
const aparicion = await consultaHoteles();
const data = await aparicion.json();
console.log(data);

function precio(numero) {
    return "$".repeat(numero);
}

function isa(texto){
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
    imgHoteles2.setAttribute("src", `./recursos/${hotels.country}-flag.png`);
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
hoteles(data);
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
} )
