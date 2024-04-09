const coordenadasCasillas = [// Las coordenadas de todas las casillas del tablero
    [100, 335], [217, 335], [280, 335], [350, 335],
    [420, 335], [490, 335], [560, 335], [630, 335],
    [700, 335], [695, 260], [695, 180], [695, 110],
    [695, 35], [625, 35], [555, 35], [485, 35],
    [415, 35], [345, 35], [275, 35], [210, 35],
    [140, 35], [140, 110], [140, 180], [140, 260],
    [217, 260], [280, 260], [350, 260], [420, 260],
    [490, 260], [560, 260], [630, 260], [625, 180],
    [625, 110], [555, 110], [485, 110], [420, 110],
    [350, 110], [280, 110], [210, 110], [210, 185],
    [280, 185], [350, 185], [430, 185]
];

let jugadores = [];//Variable vacia para el numero de jugadores
let jugadorActual = 0;
let ordenLlegada = 1;
let fichasSeleccionadas = {};//Variable vacia para el numero de fichas seleccionadas
let turnoJugador = 1;
let turnoExtra = false //Variable para determinar el turno extra si alguna ficha cae en las casillas de la oca.

function iniciarJuegoConFichas() {//funcion para conenzar con las fichas elegidas
    let fichas = Object.keys(fichasSeleccionadas).map(color => `media/Jugadores/ficha${color}.jpg`);
    inicializarJugadoresConFichas(fichas);
    //Mensaje de turno para el primer jugador
    document.getElementById("turnoMensaje").textContent = `Turno del jugador 1.`;
    // Muestra el mensaje
    document.getElementById("turnoMensaje").style.display = 'block';

}


function inicializarJugadoresConFichas(fichas) {// funcion que pone las fichas en la casilla de salida
    jugadores = [];
    for (let i = 0; i < fichas.length; i++) {
        jugadores.push({
            posicion: 0,
            ficha: fichas[i],
            activo: true, // Nuevo estado para indicar si el jugador está activo
            posicionLlegada: null // Registra el orden de llegada a la casilla 42
        });
    }
    jugadorActual = 0;
    mostrarJugadores();//llamamos a la funcion para que muestre los jugadores
}


function generarSelectoresFichas(n) { // funcion que genera las fichas para ser seleccionadas
    const container = document.getElementById("playerFichasSelection");
    container.innerHTML = ''; // Limpiar selecciones previas
    actualizarMensajeTurno(1);

    const colores = ["azul", "rojo", "verde", "amarillo"];
    colores.forEach((color, index) => {
        const img = document.createElement('img');
        img.src = `media/Jugadores/ficha${color}.jpg`; 
        img.alt = `Ficha ${color}`;
        img.classList.add("ficha-seleccion");
        img.dataset.color = color; // Guardar el color como un atributo de datos
        img.onclick = function() { seleccionarFicha(color, img); }; 
        container.appendChild(img);
    });
}



function seleccionarFicha(color, imgElement) {//función para selección de fichas
    
    if (!fichasSeleccionadas[color]) {
        fichasSeleccionadas[color] = true;
        imgElement.classList.add("selected");
        
        // Incrementa el turno y actualiza el mensaje.
        turnoJugador++;
        const numeroJugadores = parseInt(document.getElementById("playerSelect").value, 10);
        if (turnoJugador <= numeroJugadores) {
            document.getElementById("turnoMensaje").textContent = `Turno del jugador ${turnoJugador}.`;
        } else {
            // Oculta el mensaje de turno una vez que todos los jugadores han seleccionado su ficha.
            document.getElementById("turnoMensaje").style.display = 'none';
        }

        // Muestra el botón de inicio si todos han seleccionado su ficha.
        if (Object.keys(fichasSeleccionadas).length === numeroJugadores) {
            document.getElementById("startGameButton").style.display = 'block';
        }
    } 
}


function mostrarJugadores() {//función que muestra las fichas en el tablero
    const contenedor = document.getElementById("fichas");
    // Solo crea fichas si no existen aún
    if (contenedor.children.length !== jugadores.length) {
        contenedor.innerHTML = ""; // Limpia el contenedor de fichas si la cantidad de jugadores cambió
        jugadores.forEach(jugador => {
            const img = document.createElement("img");
            img.src = jugador.ficha;
            img.classList.add("jugador");
            img.style.position = "absolute";
            contenedor.appendChild(img);
        });
    }

    // Actualiza la posición de cada ficha
    document.querySelectorAll("#fichas .jugador").forEach((img, index) => {
        const [x, y] = coordenadasCasillas[jugadores[index].posicion];
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
    });
}


function nuevosJugadores() {//Función para iniciar la selección de fichas según los jugadores seleccionados
    const seleccion = parseInt(document.getElementById("playerSelect").value, 10);
    generarSelectoresFichas(seleccion);
}


function lanzarDado() {// función para lanzar el dado
    var randomNumber = Math.floor(Math.random() * 6) + 1;
    var randomDiceImage = "dice" + randomNumber + ".png";
    var randomImageSource = "./media/Dados/" + randomDiceImage;
    document.querySelector(".img1").setAttribute("src", randomImageSource);

    // Mover al jugador basado en el dado lanzado y decidir quién es el siguiente
    moverJugador(jugadorActual, randomNumber);
}
function reiniciar() {// Restablece la posición, el estado activo y la posición de llegada de cada jugador
    jugadores.forEach(jugador => {
        jugador.posicion = 0; // Todos los jugadores vuelven a la posición inicial
        jugador.activo = true; // Todos los jugadores están ahora activos nuevamente
        jugador.posicionLlegada = null; // Restablece la posición de llegada, si es relevante
    });
    jugadorActual = 0; // Reinicia el turno al primer jugador
    ordenLlegada = 1; // Restablece el orden de llegada

    // Actualiza el mensaje de turno para el primer jugador
    actualizarMensajeTurno(1);

    // Vuelve a mostrar todos los jugadores en la posición inicial
    mostrarJugadores();

    // Restablece también cualquier mensaje o estado visual del juego
    let mensajeElemento = document.getElementById("mensaje");
    if (mensajeElemento) {
        mensajeElemento.innerHTML = ""; // Limpia cualquier mensaje
    }

    // Elimina la tabla de resultados si existe
    const tablaResultados = document.getElementById("resultsTable");
    while (tablaResultados.firstChild) {
        tablaResultados.removeChild(tablaResultados.firstChild);
    }
}

function moverJugador(indiceJugador, pasos) {//Mueve al jugador un número de casillas establecido por el dado.
    let jugador = jugadores[indiceJugador];
    
       
    if (!jugador.activo) return; // Si el jugador ya no está activo, no hace nada

    let nuevaPosicion = jugador.posicion + pasos;
    
    // Verifica si la nueva posición excede la última casilla (casilla 42 en este caso)
    if (nuevaPosicion > 42) {
        // Calcula el rebote. El jugador se mueve hacia atrás por el número de pasos excedidos
        nuevaPosicion = 42 - (nuevaPosicion - 42);
    }

    jugador.posicion = nuevaPosicion; // Actualiza la posición del jugador
    
    
    if (nuevaPosicion === 42) {
        jugador.activo = false; // Marca al jugador como inactivo una vez que llega al final
        jugador.posicionLlegada = ordenLlegada++; // Asigna la posición de llegada
        turnoExtra = false;// nos aseguramos de desactivar el turnoExtra
    } else {
        actualizarPosicionJugadorConEfectosEspeciales(indiceJugador, nuevaPosicion);//comprobamos si ha caido en casillas especiales
    }
    if (!turnoExtra) {
        pasarAlSiguienteJugadorActivo();//pasamos al siguiente jugador
    }
    mostrarJugadores();
    verificarFinJuego(); // Verifica el fin del juego después de cada movimiento
}


function actualizarPosicionJugadorConEfectosEspeciales(indiceJugador, nuevaPosicion) {
    let jugador = jugadores[indiceJugador];
    const casillasEspeciales = [6, 11, 16, 21, 25, 30, 36]; //Casillas de la oca

    if (casillasEspeciales.includes(jugador.posicion)) {
        
        turnoExtra = true; // El jugador obtiene un turno extra
        
        // Encuentra la próxima casilla especial si existe, de lo contrario, queda en la misma casilla
        let indiceCasillaActual = casillasEspeciales.indexOf(jugador.posicion);
        let indiceProximaCasilla = indiceCasillaActual + 1 < casillasEspeciales.length ? indiceCasillaActual + 1 : indiceCasillaActual;
        jugador.posicion = casillasEspeciales[indiceProximaCasilla];

        mostrarMensajeEspecial("¡De oca en oca y tiro porque me toca!");// muestra el mensaje
    } else {
        // Si no es una casilla especial o después de mover al jugador, el turno extra se termina
        turnoExtra = false;
    }
}

function mostrarMensajeEspecial(mensaje) {//función para mostrar el mensaje de casilla especial
    let mensajeElemento = document.getElementById("mensaje"); 
    mensajeElemento.innerHTML = mensaje;
    
    setTimeout(() => {
        mensajeElemento.innerHTML = ""; // Limpia el mensaje después de 2 segundos
    }, 2000);
}

function pasarAlSiguienteJugadorActivo() {// Cambia el turno al siguiente jugador activo
    // Si hay un turno extra, no cambiar el jugador actual
    if (turnoExtra) {
        return;
    }

    // Encuentra el siguiente jugador activo
    const indiceInicial = jugadorActual;
    do {
        jugadorActual = (jugadorActual + 1) % jugadores.length;
    } while (!jugadores[jugadorActual].activo && jugadorActual !== indiceInicial);

    // Verifica si hemos dado la vuelta completa y todos están inactivos
    if (!jugadores[jugadorActual].activo) {
        
        console.log("Todos los jugadores han terminado.");
        verificarFinJuego();
        return;
    }

    actualizarMensajeTurno(jugadorActual + 1);
}

function verificarFinJuego() {//Comprueba si todos los jugadores están inactivos
    if (jugadores.every(jugador => !jugador.activo)) {
        console.log("El juego ha terminado.");
        // Mostrar resultados finales o cualquier lógica final aquí
        mostrarTablaLlegada();
    }
}



function actualizarMensajeTurno(numeroJugador) {//Muestra de que jugador es el turno
    const mensajeTurno = document.getElementById("turnoMensaje");
    mensajeTurno.style.display = 'block';
    mensajeTurno.textContent = `Turno del jugador ${numeroJugador}.`;
}


function mostrarTablaLlegada() {// Muestra la tabla de orden de llegada
    const jugadoresOrdenadosPorLlegada = jugadores.slice().sort((a, b) => a.posicionLlegada - b.posicionLlegada);

    // Crea una nueva tabla
    const tabla = document.createElement('table');

    // Crea y llena la cabecera de la tabla
    const cabecera = tabla.createTHead();
    const filaCabecera = cabecera.insertRow();
    filaCabecera.insertCell().textContent = 'Posición';
    filaCabecera.insertCell().textContent = 'Color';

    // Llena el cuerpo de la tabla con los jugadores ordenados
    const cuerpoTabla = tabla.createTBody();
    jugadoresOrdenadosPorLlegada.forEach((jugador, index) => {
        const fila = cuerpoTabla.insertRow();
        fila.insertCell().textContent = index + 1;
        fila.insertCell().textContent = jugador.ficha.split('/').pop().replace('.jpg', '').replace('ficha','ficha ');
    });

    // Selecciona el contenedor específico donde se mostrará la tabla
    const contenedorTabla = document.getElementById('resultsTable');

    // Elimina cualquier tabla existente dentro del contenedor antes de agregar la nueva
    while (contenedorTabla.firstChild) {
        contenedorTabla.removeChild(contenedorTabla.firstChild);
    }

    // Agrega la nueva tabla al contenedor específico
    contenedorTabla.appendChild(tabla);
}
