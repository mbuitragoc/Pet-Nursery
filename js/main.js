const DateTime = luxon.DateTime;

class Mascota {
  constructor(nombre, edad, genero, especie, id) {
    this.nombre = nombre;
    this.edad = edad;
    this.genero = genero;
    this.especie = especie;
    this.id = id;
  }
}

let listaGuarderia = JSON.parse(localStorage.getItem("datosGuarderia"));

localStorage.getItem("datosGuarderia")
  ? mostrarGuarderia()
  : (localStorage.setItem("datosGuarderia", JSON.stringify(datosGuarderia)),
    mostrarGuarderia());

listaGuarderia.forEach((element) => {
  element.horaIngreso = DateTime.now();
});

function mostrarGuarderia() {
  const guarderia = document.getElementById("guarderia");
  guarderia.innerHTML = "";

  let especie;
  const row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("gap-2");

  for (const mascota of listaGuarderia) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("col-3");
    card.classList.add("p-2");
    mascota.especie == "Perro"
      ? (especie = "perro")
      : mascota.especie == "Gato"
      ? (especie = "gato")
      : (especie = "other");

    card.innerHTML = `<img src="./icons/${especie}.jpg">
      <h5 class="card-title pt-1"> ${mascota.id}. ${mascota.nombre}</h5>
      <p> Edad: ${mascota.edad}, Genero: ${mascota.genero}, ID: ${mascota.id}`;

    const options = {
      method: "GET",
    };

    if (especie == "perro") {
      fetch("https://dog.ceo/api/breed/malamute/images/random", options)
        .then((response) => response.json())
        .then((response) => {
          url = response.message;
          card.innerHTML = `<img src="${url}">
                            <h5 class="card-title pt-1"> ${mascota.id}. ${mascota.nombre}</h5>
                            <p> Edad: ${mascota.edad}, Genero: ${mascota.genero}, ID: ${mascota.id}`;
        })
        .catch((err) => console.error(err));
    } else if (especie == "gato") {
      fetch("http://aws.random.cat/meow")
        .then((response) => response.json())
        .then((response) => {
          url = response.file;
          card.innerHTML = `<img src="${url}">
          <h5 class="card-title pt-1"> ${mascota.id}. ${mascota.nombre}</h5>
          <p> Edad: ${mascota.edad}, Genero: ${mascota.genero}, ID: ${mascota.id}`;
        })
        .catch((err) => console.error(err));
    }
    row.append(card);
  }
  guarderia.append(row);
}

document.getElementById("agregar").addEventListener("click", function () {
  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const genero = document.getElementById("genero").value;
  const especie = document.getElementById("especie").value;
  const id = listaGuarderia.length + 1;

  if (nombre != "") {
    const mascota = new Mascota(nombre, edad, genero, especie, id);
    mascota.horaIngreso = DateTime.now();
    listaGuarderia.push(mascota);
    document.getElementById(
      "mensaje"
    ).innerHTML = `<p>${nombre} ingreso en la Guarderia</p>`;

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Ingreso en Guarderia Exitoso",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "No se pudo ingresar en Guarderia",
      text: "Verifica los datos de la mascota",
    });
  }

  mostrarGuarderia();
  localStorage.setItem("datosGuarderia", JSON.stringify(listaGuarderia));
});

document.getElementById("eliminar").addEventListener("click", function () {
  const nombre = document.getElementById("nombre").value;
  indexRetiro = listaGuarderia.indexOf(
    listaGuarderia.find((e) => e.nombre == nombre)
  );

  if (indexRetiro != -1) {
    let estadia = listaGuarderia[indexRetiro].horaIngreso
      .diffNow()
      .toObject().milliseconds;

    let estadiaMinutes = (estadia) => {
      let millis = Math.abs(estadia);
      let minutes = Math.floor(millis / 60000);
      let seconds = ((millis % 60000) / 1000).toFixed(0);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    console.log("Interval", estadiaMinutes);

    listaGuarderia[indexRetiro].estadia = estadia;

    listaGuarderia.splice(indexRetiro, 1);
    document.getElementById(
      "mensaje"
    ).innerHTML = `<p>${nombre} fue retirada de la Guarderia</p>
                  <p> ${nombre} se quedo durante ${estadiaMinutes(
      estadia
    )} minutos`;

    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Retiro de la Guarderia Exitoso",
      text: "Gracias por utilizar nuestros servicios",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "No se encuentra en Guarderia",
      text: "Verifica el nombre de la mascota",
    });
  }

  mostrarGuarderia();
  localStorage.setItem("datosGuarderia", JSON.stringify(listaGuarderia));
});

localStorage.getItem("datosGuarderia")
  ? mostrarGuarderia()
  : (localStorage.setItem("datosGuarderia", JSON.stringify(datosGuarderia)),
    mostrarGuarderia());
