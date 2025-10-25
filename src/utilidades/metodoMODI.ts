// metodoMODI.ts
// Implementación del Método de Multiplicadores (MODI - Modified Distribution Method)
// Este método optimiza una solución inicial usando multiplicadores ui y vj

import type { ProblemaTransporte, Celda, PasoExplicacion } from '../tipos/tipos';

/**
 * MÉTODO MODI (Modified Distribution Method)
 * Este método mejora una solución inicial hasta encontrar la solución óptima
 * Usa multiplicadores (ui, vj) para identificar si puedo mejorar mi solución
 */
export function metodoMODI(
  problema: ProblemaTransporte,
  solucionInicial: Celda[][],
  generarPasos: boolean = false
): { solucion: Celda[][], pasos: PasoExplicacion[], esOptima: boolean } {
  
  // Creo una copia de la solución inicial para no modificar la original
  let solucionActual = JSON.parse(JSON.stringify(solucionInicial)) as Celda[][];
  const pasos: PasoExplicacion[] = [];
  let iteracion = 0;
  const maxIteraciones = 100; // Límite para evitar bucles infinitos
  
  // Agrego el paso inicial
  if (generarPasos) {
    pasos.push({
      tipo: 'inicial',
      titulo: 'Solución Inicial',
      descripcion: `Esta es mi solución inicial. Ahora voy a verificar si es óptima usando el método MODI.`,
      matriz: JSON.parse(JSON.stringify(solucionActual))
    });
  }

  // Continúo iterando hasta encontrar la solución óptima
  while (iteracion < maxIteraciones) {
    iteracion++;
    
    // PASO 1: Calculo los multiplicadores ui y vj
    // Para las celdas básicas se cumple: ui + vj = cij
    const { ui, vj } = calcularMultiplicadores(problema, solucionActual);
    
    if (generarPasos) {
      pasos.push({
        tipo: 'calcular-ui-vj',
        titulo: `Iteración ${iteracion}: Calcular Multiplicadores`,
        descripcion: `Calculo los valores ui (para filas) y vj (para columnas). Para cada celda básica debe cumplirse: ui + vj = costo de la celda.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        ui: [...ui],
        vj: [...vj]
      });
    }
    
    // PASO 2: Calculo los costos reducidos para las celdas no básicas
    // Costo reducido = cij - (ui + vj)
    const costosReducidos = calcularCostosReducidos(problema, solucionActual, ui, vj);
    
    if (generarPasos) {
      pasos.push({
        tipo: 'calcular-costos-reducidos',
        titulo: `Iteración ${iteracion}: Calcular Costos Reducidos`,
        descripcion: `Para cada celda no básica, calculo el costo reducido: cij - (ui + vj). Si todos son >= 0, la solución es óptima.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        costosReducidos: costosReducidos.map(fila => [...fila])
      });
    }
    
    // PASO 3: Verifico si la solución es óptima
    // La solución es óptima si todos los costos reducidos son >= 0
    const { esOptima, celdaMejora } = verificarOptimalidad(costosReducidos, solucionActual);
    
    if (esOptima) {
      if (generarPasos) {
        pasos.push({
          tipo: 'verificar-optimalidad',
          titulo: `Iteración ${iteracion}: Solución Óptima Encontrada`,
          descripcion: `Todos los costos reducidos son >= 0, por lo tanto esta es mi solución óptima.`,
          matriz: JSON.parse(JSON.stringify(solucionActual))
        });
      }
      
      return { solucion: solucionActual, pasos, esOptima: true };
    }
    
    // PASO 4: Si no es óptima, mejoro la solución
    // Encuentro un ciclo y ajusto las asignaciones
    const ciclo = encontrarCiclo(solucionActual, celdaMejora!);
    
    if (generarPasos) {
      pasos.push({
        tipo: 'mejorar-solucion',
        titulo: `Iteración ${iteracion}: Mejorar Solución`,
        descripcion: `Encontré una celda con costo reducido negativo en (${celdaMejora!.fila + 1}, ${celdaMejora!.columna + 1}). Formo un ciclo y ajusto las asignaciones para mejorar la solución.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        celdaMejora: celdaMejora || undefined,
        ciclo
      });
    }
    
    // Ajusto las asignaciones siguiendo el ciclo
    solucionActual = ajustarAsignaciones(solucionActual, ciclo);
  }
  
  // Si llegué aquí, alcancé el límite de iteraciones
  return { solucion: solucionActual, pasos, esOptima: false };
}

/**
 * Calcula los multiplicadores ui (filas) y vj (columnas)
 * Para cada celda básica se cumple: ui + vj = cij
 */
function calcularMultiplicadores(
  problema: ProblemaTransporte,
  solucion: Celda[][]
): { ui: (number | null)[], vj: (number | null)[] } {
  
  const ui: (number | null)[] = Array(problema.filas).fill(null);
  const vj: (number | null)[] = Array(problema.columnas).fill(null);
  
  // Empiezo asignando u0 = 0 (primera fila)
  ui[0] = 0;
  
  // Necesito resolver el sistema de ecuaciones
  // Uso un enfoque iterativo hasta que todos los valores estén calculados
  let cambios = true;
  let iteraciones = 0;
  const maxIter = 1000;
  
  while (cambios && iteraciones < maxIter) {
    cambios = false;
    iteraciones++;
    
    // Para cada celda básica
    for (let i = 0; i < problema.filas; i++) {
      for (let j = 0; j < problema.columnas; j++) {
        if (solucion[i][j].esBasica) {
          const costo = solucion[i][j].costo;
          
          // Si conozco ui, puedo calcular vj
          if (ui[i] !== null && vj[j] === null) {
            vj[j] = costo - ui[i]!;
            cambios = true;
          }
          // Si conozco vj, puedo calcular ui
          else if (vj[j] !== null && ui[i] === null) {
            ui[i] = costo - vj[j]!;
            cambios = true;
          }
        }
      }
    }
  }
  
  return { ui, vj };
}

/**
 * Calcula los costos reducidos para todas las celdas
 * Costo reducido = cij - (ui + vj)
 */
function calcularCostosReducidos(
  problema: ProblemaTransporte,
  solucion: Celda[][],
  ui: (number | null)[],
  vj: (number | null)[]
): number[][] {
  
  const costosReducidos: number[][] = Array(problema.filas).fill(null).map(() =>
    Array(problema.columnas).fill(0)
  );
  
  for (let i = 0; i < problema.filas; i++) {
    for (let j = 0; j < problema.columnas; j++) {
      // Para celdas no básicas, calculo el costo reducido
      if (!solucion[i][j].esBasica) {
        const uiVal = ui[i] ?? 0;
        const vjVal = vj[j] ?? 0;
        costosReducidos[i][j] = solucion[i][j].costo - (uiVal + vjVal);
      }
    }
  }
  
  return costosReducidos;
}

/**
 * Verifica si la solución es óptima
 * La solución es óptima si todos los costos reducidos son >= 0
 */
function verificarOptimalidad(
  costosReducidos: number[][],
  solucion: Celda[][]
): { esOptima: boolean, celdaMejora: { fila: number, columna: number } | null } {
  
  let minCostoReducido = 0;
  let celdaMejora: { fila: number, columna: number } | null = null;
  
  for (let i = 0; i < costosReducidos.length; i++) {
    for (let j = 0; j < costosReducidos[i].length; j++) {
      if (!solucion[i][j].esBasica && costosReducidos[i][j] < minCostoReducido) {
        minCostoReducido = costosReducidos[i][j];
        celdaMejora = { fila: i, columna: j };
      }
    }
  }
  
  return {
    esOptima: celdaMejora === null,
    celdaMejora
  };
}

/**
 * Encuentra un ciclo que incluya la celda de mejora
 * El ciclo es un camino cerrado que alterna celdas básicas horizontales y verticales
 */
function encontrarCiclo(
  solucion: Celda[][],
  celdaInicio: { fila: number, columna: number }
): { fila: number, columna: number }[] {
  
  const filas = solucion.length;
  const columnas = solucion[0].length;
  
  // Uso búsqueda en profundidad (DFS) para encontrar el ciclo
  const visitadas = new Set<string>();
  const ciclo: { fila: number, columna: number }[] = [];
  
  function dfs(
    fila: number,
    columna: number,
    esHorizontal: boolean,
    profundidad: number
  ): boolean {
    
    const clave = `${fila},${columna}`;
    
    // Si volví al inicio y tengo al menos 4 nodos, encontré el ciclo
    if (profundidad > 0 && fila === celdaInicio.fila && columna === celdaInicio.columna) {
      if (ciclo.length >= 3) {
        return true;
      }
      return false;
    }
    
    // Si ya visité esta celda, retorno
    if (visitadas.has(clave)) {
      return false;
    }
    
    ciclo.push({ fila, columna });
    visitadas.add(clave);
    
    // Busco siguiente celda
    if (esHorizontal) {
      // Me muevo horizontalmente (cambio de columna)
      for (let j = 0; j < columnas; j++) {
        if (j !== columna && (solucion[fila][j].esBasica || (fila === celdaInicio.fila && j === celdaInicio.columna))) {
          if (dfs(fila, j, false, profundidad + 1)) {
            return true;
          }
        }
      }
    } else {
      // Me muevo verticalmente (cambio de fila)
      for (let i = 0; i < filas; i++) {
        if (i !== fila && (solucion[i][columna].esBasica || (i === celdaInicio.fila && columna === celdaInicio.columna))) {
          if (dfs(i, columna, true, profundidad + 1)) {
            return true;
          }
        }
      }
    }
    
    ciclo.pop();
    visitadas.delete(clave);
    return false;
  }
  
  // Inicio la búsqueda desde la celda de mejora
  dfs(celdaInicio.fila, celdaInicio.columna, true, 0);
  
  return ciclo;
}

/**
 * Ajusta las asignaciones siguiendo el ciclo encontrado
 * En el ciclo, sumo y resto alternadamente para mantener balance
 */
function ajustarAsignaciones(
  solucion: Celda[][],
  ciclo: { fila: number, columna: number }[]
): Celda[][] {
  
  const nuevaSolucion = JSON.parse(JSON.stringify(solucion)) as Celda[][];
  
  if (ciclo.length < 4) {
    return nuevaSolucion;
  }
  
  // Encuentro la cantidad mínima en las celdas donde voy a restar
  let theta = Infinity;
  
  for (let k = 1; k < ciclo.length; k += 2) {
    const { fila, columna } = ciclo[k];
    if (nuevaSolucion[fila][columna].asignacion < theta) {
      theta = nuevaSolucion[fila][columna].asignacion;
    }
  }
  
  // Ajusto las asignaciones
  for (let k = 0; k < ciclo.length; k++) {
    const { fila, columna } = ciclo[k];
    
    if (k % 2 === 0) {
      // Sumo en posiciones pares
      nuevaSolucion[fila][columna].asignacion += theta;
      nuevaSolucion[fila][columna].esBasica = true;
    } else {
      // Resto en posiciones impares
      nuevaSolucion[fila][columna].asignacion -= theta;
      if (nuevaSolucion[fila][columna].asignacion === 0) {
        nuevaSolucion[fila][columna].esBasica = false;
      }
    }
  }
  
  return nuevaSolucion;
}

/**
 * Calcula el costo total de una solución
 */
export function calcularCostoTotal(solucion: Celda[][]): number {
  let costoTotal = 0;
  
  for (let i = 0; i < solucion.length; i++) {
    for (let j = 0; j < solucion[i].length; j++) {
      costoTotal += solucion[i][j].costo * solucion[i][j].asignacion;
    }
  }
  
  return costoTotal;
}
