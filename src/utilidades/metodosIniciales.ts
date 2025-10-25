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