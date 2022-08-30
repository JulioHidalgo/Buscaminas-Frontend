import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

let arrayPiezasGlobal:any;
let numPiezasDescubiertas:number;
let scorePlayer = 0;

@Component({
	selector:'app-root',
	templateUrl:'./app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	// Variables
	title = 'BuscaminasFrontend';
	namePlayer = "Jugador";
	scorePlayer = "0";
	timePlayer = "00:00";
	contenido: String = "";
	arrayPiezas = [];

	// Link
	@ViewChild('contenido') contenedor: ElementRef;
	@ViewChild('btnInicio') btnInicio: ElementRef;
	@ViewChild('botoneraFooter') panelbotoneraFooter: ElementRef;

	StartGameEvent() {
		this.panelbotoneraFooter.nativeElement.style.visibility = "visible";

		const piezas=100
		const bombas=15


		// Inicializamos Array
		let arrayPiezas = new Array(piezas);
		arrayPiezas = this.colocarBombas(arrayPiezas, bombas);
		arrayPiezas = this.checkBombs(arrayPiezas, piezas);
		console.log("RESULTADO");
		console.log(arrayPiezas);

		// Guardamos partida actual en Global
		arrayPiezasGlobal = arrayPiezas;

		// Oculta botón Iniciar partida
		this.btnInicio.nativeElement.style.display = "none";

		this.PrepararPlantilla(arrayPiezas);
	}

	/**
	 * Metodo prepara la interfaz de la tabla
	 * @param {array} arrayPiezas Recibe el número de piezas que se mostraran
	 */
	PrepararPlantilla(arrayPiezas) {
		const cuadrado = Math.sqrt(arrayPiezas.length);
		const tableBase = document.createElement('table');
		const tbody = document.createElement('tbody');
		let numPieza = 0;

		for (let i = 0; i < cuadrado; i++) {
			const fila = document.createElement('tr');

			for (let c = 0; c < cuadrado; c++) {
				const columna = document.createElement('td');
				columna.id = "piece" + numPieza;
				columna.addEventListener("click", ControladorCelda);
				columna.style.backgroundImage = "url(\"assets/Bloques/Bloque1.gif\")"
				columna.style.backgroundSize = "contain";

				numPieza++;
				fila.appendChild(columna);
			}

			tbody.appendChild(fila);
		}
		tableBase.appendChild(tbody);
		this.contenedor.nativeElement.appendChild(tableBase);
	}

	/**
	 * Metodo realiza la colocación aleatoria de las bombas
	 * @param {array} arrayPiezas 
	 * @param {int} numBombas 
	 */
	colocarBombas(arrayPiezas:any, numBombas:number) {

		// Generar posiciones de las bombas
		const posicionesbombas = [];
		for (let i = 0; i < numBombas; i++) {
			let aleatorio = -1;
			let valido = false;

			while (!valido) {
				aleatorio = Math.floor((Math.random() * arrayPiezas.length));

				if (!posicionesbombas.includes(aleatorio)) {
					valido = true;
				}
			}

			posicionesbombas.push(aleatorio);
		}

		console.log("Coloco bombas en las posiciones: " + posicionesbombas);

		// Colocar bombas
		for (let i = 0; i < posicionesbombas.length; i++) {
			arrayPiezas[posicionesbombas[i]] = -1;
		}

		return arrayPiezas;
	}

	/**
	 * Metodo devuelve en que cordenada se encuentra una pieza
	 * @param {int} numPieza Número de la pieza del puzzle
	 * @param {int} totalPiezas Número total de piezzas del puzle
	 * @returns {array} Número Fila x Columna-
	 */
	coordenadaPieza(numPieza:number, totalPiezas:number) {
		let cuadrado = Math.sqrt(totalPiezas);

		// Calculamos la fila y la columna
		const fila = Math.round(numPieza / cuadrado);
		const columna = Math.round(numPieza % cuadrado);

		const posicion = [];
		posicion[0] = fila;   // FILA ~ Alto
		posicion[1] = columna;   // COLUMNA ~ Ancho

		return posicion;
	}

	/**
	 * EL metodo comprueba cuantas bombas hay alrededor de cada pieza y lo registra con un numero.
	 * @param piezas Array con las piezas
	 * @returns {Array} Devuelve un array de 2 dimensiones con todas los valores resultantes
	 */
	checkBombs(arrayPiezas, numPiezas) {
		// Comenzamos comprobación
		let cuadrado = Math.sqrt(numPiezas);

		// Analizamos cada pieza 
		for (let i = 0; i < arrayPiezas.length; i++) {
			let contadorBomba = 0;

			// Descartamos que sea bomba
			if (arrayPiezas[i] != -1) {
				// No hay bomba bro
				let izquierda: boolean = true, derecha: boolean = true, arriba: boolean = true, abajo: boolean = true;

				// Habilitamos izquierda ?
				if (Math.floor(i / cuadrado) != Math.floor((i - 1) / cuadrado)) {
					izquierda = false;
					console.log("#" + i + " Izquierda desactivado\n" + Math.floor(i / cuadrado) + " vs " + Math.floor((i - 1) / cuadrado));
				}

				// Habilitamos derecha ?
				if (Math.floor(i / cuadrado) != Math.floor((i + 1) / cuadrado)) {
					derecha = false;
					console.log("#" + i + " Derecha desactivado\n" + Math.floor(i / cuadrado) + " vs " + Math.floor((i + 1) / cuadrado));
				}

				// Habilitamos arriba ?
				if ((i - cuadrado) == undefined) {
					arriba = false;
					console.log("#" + i + " Arriba desactivado");
				}

				// Habilitamos abajo ?
				if ((i + cuadrado) == undefined) {
					abajo = false;
					console.log("#" + i + " Abajo desactivado");
				}

				// Checkea en todas las direcciones habilitadas

				// Izquierda
				if (izquierda && arrayPiezas[(i - 1)] == -1) { contadorBomba++ }
				// Derecha
				if (derecha && arrayPiezas[(i + 1)] == -1) { contadorBomba++ }
				// Arriba
				if (arriba && arrayPiezas[(i - cuadrado)] == -1) { contadorBomba++ }
				// Arriba Izquierda
				if (arriba && izquierda && arrayPiezas[(i - cuadrado - 1)] == -1) { contadorBomba++ }
				// Arriba Derecha
				if (arriba && derecha && arrayPiezas[(i - cuadrado + 1)] == -1) { contadorBomba++ }
				// Abajo
				if (abajo && arrayPiezas[(i + cuadrado)] == -1) { contadorBomba++ }
				// Abajo Izquierda
				if (abajo && izquierda && arrayPiezas[(i + cuadrado - 1)] == -1) { contadorBomba++ }
				// Abajo Derecha
				if (abajo && derecha && arrayPiezas[(i + cuadrado + 1)] == -1) { contadorBomba++ }
			} else {
				// Es la bomba :O
				contadorBomba = -1;
			}

			arrayPiezas[i] = contadorBomba;
		}

		return arrayPiezas;
	}
}

/**
 * Controlador de la pieza con sus metodos y comprobaciones
 */
function ControladorCelda() {
	console.log(this.id);
	// Obtenemos número de la pieza
	const numeroPieza = this.id.replace("piece", "");

	// BOMBA
	const listadoBombas = [];

	// Posiciones de las bombas
	for (let b = 0; b < arrayPiezasGlobal.length; b++) {
		// Sacar las piezas donde hay bomba realmente
		if (arrayPiezasGlobal[b] == -1) {
			listadoBombas.push(b);
		}
	}

	// Realizamos comprobaciones
	if (arrayPiezasGlobal[numeroPieza] == -1) {
		// Aplicar bomba a las piezas
		for (let a = 0; a < listadoBombas.length; a++) {
			document.getElementById("piece" + listadoBombas[a]).style.backgroundImage = "url(\"assets/Bloques/explosion.gif\")";
			document.getElementById("piece" + listadoBombas[a]).style.backgroundSize = "contain";
		}

		// Eliminar todos los click
		const celdas = document.getElementsByTagName("td");
		for (let i = 0; i < celdas.length; i++) {
			celdas[i].removeEventListener("click", ControladorCelda);
		}

		// Fin del Juego donde has perdido
		document.getElementsByClassName("neon")[0].textContent = "Has";
		document.getElementsByClassName("flux")[0].textContent = "Perdido";
	} else {
		scorePlayer+= arrayPiezasGlobal[numeroPieza] * 2;
		document.getElementById("puntuacion").textContent = "Puntuación: " + scorePlayer;	

		this.textContent = arrayPiezasGlobal[numeroPieza];
		this.style.backgroundImage = "url(\"assets/Bloques/bloque2.png\")"
		this.style.backgroundSize = "contain";
		this.style.fontSize = "2em";

		// Comprobamos que has ganado
		if (numPiezasDescubiertas == (arrayPiezasGlobal.length - listadoBombas.length)){
			// Cuando Ganas
			document.getElementsByClassName("neon")[0].textContent = "Has";
			document.getElementsByClassName("flux")[0].textContent = "Ganado";	
			document.getElementById("puntuacion").innerHTML = "Fin | " + scorePlayer;	
		}
	}

	// Quitamos propiedad click
	this.removeEventListener("click", ControladorCelda);
	this.removeEventListener("contextmenu", ControladorCelda);
}

