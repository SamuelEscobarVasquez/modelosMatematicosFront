// metodosIniciales.ts
// Aquí implemento los tres métodos para encontrar una solución inicial
// Estos métodos me dan un punto de partida para luego optimizar con MODI

import type { ProblemaTransporte, Celda } from '../tipos/tipos';

/**
 * MÉTODO DE LA ESQUINA NOROESTE
 * Este es el método más sencillo. Empiezo desde la esquina superior izquierda
 * y voy asignando la máxima cantidad posible, moviéndome hacia la derecha o abajo
 */
export function esquinaNoroeste(problema: ProblemaTransporte): Celda[][] {
  // Creo una copia de oferta y demanda porque las voy a modificar
  const ofertaDisponible = [...problema.oferta];
  const demandaDisponible = [...problema.demanda];
  
  // Inicializo mi matriz de solución con celdas vacías
  const solucion: Celda[][] = Array(problema.filas).fill(null).map((_, i) =>
    Array(problema.columnas).fill(null).map((_, j) => ({
      costo: problema.costos[i][j],
      asignacion: 0,
      esBasica: false
    }))
  );

  // Empiezo desde la esquina superior izquierda
  let fila = 0;
  let columna = 0;

  // Mientras no haya procesado todas las filas y columnas
  while (fila < problema.filas && columna < problema.columnas) {
    // Calculo cuánto puedo asignar: el mínimo entre oferta y demanda disponible
    const cantidad = Math.min(ofertaDisponible[fila], demandaDisponible[columna]);
    
    // Asigno esa cantidad a la celda actual
    solucion[fila][columna].asignacion = cantidad;
    solucion[fila][columna].esBasica = true;
    
    // Actualizo la oferta y demanda disponible
    ofertaDisponible[fila] -= cantidad;
    demandaDisponible[columna] -= cantidad;
    
    // Decido hacia dónde moverme:
    // Si la oferta se agotó, bajo a la siguiente fila
    // Si la demanda se satisfizo, me muevo a la siguiente columna
    if (ofertaDisponible[fila] === 0) {
      fila++;
    } else {
      columna++;
    }
  }

  return solucion;
}

/**
 * MÉTODO DEL COSTO MÍNIMO
 * Este método busca asignar primero a las celdas con menor costo
 * Es más inteligente que esquina noroeste porque considera los costos
 */
export function costoMinimo(problema: ProblemaTransporte): Celda[][] {
  // Creo copias para modificar
  const ofertaDisponible = [...problema.oferta];
  const demandaDisponible = [...problema.demanda];
  
  // Inicializo la matriz de solución
  const solucion: Celda[][] = Array(problema.filas).fill(null).map((_, i) =>
    Array(problema.columnas).fill(null).map((_, j) => ({
      costo: problema.costos[i][j],
      asignacion: 0,
      esBasica: false
    }))
  );

  // Creo una lista de todas las celdas posibles con su información
  const celdasOrdenadas: {fila: number, columna: number, costo: number}[] = [];
  
  for (let i = 0; i < problema.filas; i++) {
    for (let j = 0; j < problema.columnas; j++) {
      celdasOrdenadas.push({
        fila: i,
        columna: j,
        costo: problema.costos[i][j]
      });
    }
  }
  
  // Ordeno las celdas de menor a mayor costo
  celdasOrdenadas.sort((a, b) => a.costo - b.costo);

  // Proceso cada celda en orden de menor costo
  for (const celda of celdasOrdenadas) {
    const { fila, columna } = celda;
    
    // Verifico si aún hay oferta y demanda disponible
    if (ofertaDisponible[fila] > 0 && demandaDisponible[columna] > 0) {
      // Asigno la cantidad máxima posible
      const cantidad = Math.min(ofertaDisponible[fila], demandaDisponible[columna]);
      
      solucion[fila][columna].asignacion = cantidad;
      solucion[fila][columna].esBasica = true;
      
      // Actualizo oferta y demanda
      ofertaDisponible[fila] -= cantidad;
      demandaDisponible[columna] -= cantidad;
    }
  }

  return solucion;
}

/**
 * MÉTODO DE VOGEL (VAM - Vogel's Approximation Method)
 * Este es el método más sofisticado de los tres
 * Calcula penalizaciones para decidir dónde asignar
 * Las penalizaciones representan el costo de no usar la ruta más barata
 */
export function vogel(problema: ProblemaTransporte): Celda[][] {
  // Creo copias para modificar
  const ofertaDisponible = [...problema.oferta];
  const demandaDisponible = [...problema.demanda];
  
  // Control de filas y columnas eliminadas
  const filasEliminadas = new Set<number>();
  const columnasEliminadas = new Set<number>();
  
  // Inicializo la matriz de solución
  const solucion: Celda[][] = Array(problema.filas).fill(null).map((_, i) =>
    Array(problema.columnas).fill(null).map((_, j) => ({
      costo: problema.costos[i][j],
      asignacion: 0,
      esBasica: false
    }))
  );

  // Continúo mientras haya filas y columnas disponibles
  while (filasEliminadas.size < problema.filas && columnasEliminadas.size < problema.columnas) {
    // Calculo las penalizaciones para cada fila
    const penalizacionesFilas: (number | null)[] = [];
    
    for (let i = 0; i < problema.filas; i++) {
      if (filasEliminadas.has(i)) {
        penalizacionesFilas[i] = null;
        continue;
      }
      
      // Obtengo los costos de las columnas disponibles
      const costosDisponibles = [];
      for (let j = 0; j < problema.columnas; j++) {
        if (!columnasEliminadas.has(j)) {
          costosDisponibles.push(problema.costos[i][j]);
        }
      }
      
      // La penalización es la diferencia entre los dos menores costos
      if (costosDisponibles.length >= 2) {
        costosDisponibles.sort((a, b) => a - b);
        penalizacionesFilas[i] = costosDisponibles[1] - costosDisponibles[0];
      } else if (costosDisponibles.length === 1) {
        penalizacionesFilas[i] = costosDisponibles[0];
      } else {
        penalizacionesFilas[i] = null;
      }
    }
    
    // Calculo las penalizaciones para cada columna
    const penalizacionesColumnas: (number | null)[] = [];
    
    for (let j = 0; j < problema.columnas; j++) {
      if (columnasEliminadas.has(j)) {
        penalizacionesColumnas[j] = null;
        continue;
      }
      
      // Obtengo los costos de las filas disponibles
      const costosDisponibles = [];
      for (let i = 0; i < problema.filas; i++) {
        if (!filasEliminadas.has(i)) {
          costosDisponibles.push(problema.costos[i][j]);
        }
      }
      
      // La penalización es la diferencia entre los dos menores costos
      if (costosDisponibles.length >= 2) {
        costosDisponibles.sort((a, b) => a - b);
        penalizacionesColumnas[j] = costosDisponibles[1] - costosDisponibles[0];
      } else if (costosDisponibles.length === 1) {
        penalizacionesColumnas[j] = costosDisponibles[0];
      } else {
        penalizacionesColumnas[j] = null;
      }
    }
    
    // Encuentro la máxima penalización
    let maxPenalizacion = -1;
    let esFila = true;
    let indice = 0;
    
    // Busco en filas
    for (let i = 0; i < penalizacionesFilas.length; i++) {
      if (penalizacionesFilas[i] !== null && penalizacionesFilas[i]! > maxPenalizacion) {
        maxPenalizacion = penalizacionesFilas[i]!;
        esFila = true;
        indice = i;
      }
    }
    
    // Busco en columnas
    for (let j = 0; j < penalizacionesColumnas.length; j++) {
      if (penalizacionesColumnas[j] !== null && penalizacionesColumnas[j]! > maxPenalizacion) {
        maxPenalizacion = penalizacionesColumnas[j]!;
        esFila = false;
        indice = j;
      }
    }
    
    // Ahora asigno en la celda de menor costo de la fila/columna seleccionada
    let minCosto = Infinity;
    let filaAsignar = -1;
    let columnaAsignar = -1;
    
    if (esFila) {
      // Busco la columna con menor costo en esta fila
      for (let j = 0; j < problema.columnas; j++) {
        if (!columnasEliminadas.has(j) && problema.costos[indice][j] < minCosto) {
          minCosto = problema.costos[indice][j];
          filaAsignar = indice;
          columnaAsignar = j;
        }
      }
    } else {
      // Busco la fila con menor costo en esta columna
      for (let i = 0; i < problema.filas; i++) {
        if (!filasEliminadas.has(i) && problema.costos[i][indice] < minCosto) {
          minCosto = problema.costos[i][indice];
          filaAsignar = i;
          columnaAsignar = indice;
        }
      }
    }
    
    // Realizo la asignación
    if (filaAsignar !== -1 && columnaAsignar !== -1) {
      const cantidad = Math.min(ofertaDisponible[filaAsignar], demandaDisponible[columnaAsignar]);
      
      solucion[filaAsignar][columnaAsignar].asignacion = cantidad;
      solucion[filaAsignar][columnaAsignar].esBasica = true;
      
      ofertaDisponible[filaAsignar] -= cantidad;
      demandaDisponible[columnaAsignar] -= cantidad;
      
      // Marco como eliminada la fila o columna que se agotó
      if (ofertaDisponible[filaAsignar] === 0) {
        filasEliminadas.add(filaAsignar);
      }
      if (demandaDisponible[columnaAsignar] === 0) {
        columnasEliminadas.add(columnaAsignar);
      }
    }
  }

  return solucion;
}
