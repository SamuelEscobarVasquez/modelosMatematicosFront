// metodoMODI.ts
// Implementación del Método de Multiplicadores (MODI - Modified Distribution Method)
// Este método optimiza una solución inicial usando multiplicadores ui y vj

import type { ProblemaTransporte, Celda, PasoExplicacion, MetodoInicial } from '../tipos/tipos';

/**
 * MÉTODO MODI (Modified Distribution Method)
 * Este método mejora una solución inicial hasta encontrar la solución óptima
 * Usa multiplicadores (ui, vj) para identificar si puedo mejorar mi solución
 */
export function metodoMODI(
  problema: ProblemaTransporte,
  solucionInicial: Celda[][],
  metodoInicialUsado: MetodoInicial,
  generarPasos: boolean = false
): { solucion: Celda[][], pasos: PasoExplicacion[], esOptima: boolean } {
  
  // Creo una copia de la solución inicial para no modificar la original
  let solucionActual = JSON.parse(JSON.stringify(solucionInicial)) as Celda[][];
  const pasos: PasoExplicacion[] = [];
  let iteracion = 0;
  const maxIteraciones = 100; // Límite para evitar bucles infinitos
  
  // Agrego el paso de la solución inicial
  if (generarPasos) {
    pasos.push({
      tipo: 'solucion-inicial',
      titulo: `Solución Inicial - Método ${
        metodoInicialUsado === 'esquina-noroeste' ? 'Esquina Noroeste' :
        metodoInicialUsado === 'costo-minimo' ? 'Costo Mínimo' :
        'Vogel (VAM)'
      }`,
      descripcion: `He obtenido esta solución inicial usando el método ${
        metodoInicialUsado === 'esquina-noroeste' ? 'de la Esquina Noroeste' :
        metodoInicialUsado === 'costo-minimo' ? 'del Costo Mínimo' :
        'de Vogel'
      }. Ahora voy a verificar si es óptima y optimizarla usando el Método MODI (Multiplicadores).`,
      matriz: JSON.parse(JSON.stringify(solucionActual)),
      metodoInicial: metodoInicialUsado
    });
  }

  // Continúo iterando hasta encontrar la solución óptima
  while (iteracion < maxIteraciones) {
    iteracion++;
    
    // PASO 1: Calculo los multiplicadores ui y vj
    // Para las celdas básicas se cumple: ui + vj = cij
    const { ui, vj, formulasUI, formulasVJ } = calcularMultiplicadores(problema, solucionActual);
    
    if (generarPasos) {
      pasos.push({
        tipo: 'calcular-ui-vj',
        titulo: `Iteración ${iteracion}: Calcular Multiplicadores ui y vj`,
        descripcion: `Calculo los valores ui (para filas) y vj (para columnas). Para cada celda básica debe cumplirse la ecuación: ui + vj = Cij (costo de la celda). Inicio con u₁ = 0 y despejo las demás ecuaciones.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        ui: [...ui],
        vj: [...vj],
        formulasUI,
        formulasVJ
      });
    }
    
    // PASO 2: Calculo las variables no básicas
    // Fórmula: Ui + Vj - Cij
    const variablesNoBasicas = calcularCostosReducidos(problema, solucionActual, ui, vj);
    
    if (generarPasos) {
      pasos.push({
        tipo: 'calcular-variables-no-basicas',
        titulo: `Iteración ${iteracion}: Calcular Variables No Básicas`,
        descripcion: `Para cada celda no básica, calculo la variable no básica usando la fórmula: Ui + Vj - Cij. Si todas son ≤ 0, la solución es óptima. Si hay valores positivos, busco el mayor (theta) para mejorar.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        variablesNoBasicas: variablesNoBasicas.map(fila => [...fila]),
        ui: [...ui],
        vj: [...vj]
      });
    }
    
    // PASO 3: Verifico si la solución es óptima
    // La solución es óptima si todas las variables no básicas son <= 0
    const { esOptima, celdaMejora } = verificarOptimalidad(variablesNoBasicas, solucionActual);
    
    if (esOptima) {
      if (generarPasos) {
        pasos.push({
          tipo: 'verificar-optimalidad',
          titulo: `Iteración ${iteracion}: Solución Óptima Encontrada`,
          descripcion: `Todas las variables no básicas son ≤ 0, por lo tanto esta es mi solución óptima. ¡He encontrado la mejor distribución posible!`,
          matriz: JSON.parse(JSON.stringify(solucionActual))
        });
      }
      
      return { solucion: solucionActual, pasos, esOptima: true };
    }
    
    // PASO 4: Si no es óptima, mejoro la solución
    // Encuentro un ciclo y ajusto las asignaciones
    const ciclo = encontrarCiclo(solucionActual, celdaMejora!);
    
    // Calculo theta (la cantidad a ajustar)
    let theta = Infinity;
    for (let k = 1; k < ciclo.length; k += 2) {
      const { fila, columna } = ciclo[k];
      if (solucionActual[fila][columna].asignacion < theta) {
        theta = solucionActual[fila][columna].asignacion;
      }
    }
    
    if (generarPasos) {
      pasos.push({
        tipo: 'mejorar-solucion',
        titulo: `Iteración ${iteracion}: Mejorar Solución`,
        descripcion: `Encontré que la celda en posición (${celdaMejora!.fila + 1}, ${celdaMejora!.columna + 1}) tiene el valor theta (variable no básica) más positivo = ${variablesNoBasicas[celdaMejora!.fila][celdaMejora!.columna]}. Formo un ciclo cerrado y ajusto las asignaciones sumando y restando θ = ${theta} alternadamamente.`,
        matriz: JSON.parse(JSON.stringify(solucionActual)),
        celdaMejora: celdaMejora || undefined,
        ciclo,
        theta,
        variablesNoBasicas: variablesNoBasicas.map(fila => [...fila])
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
): { ui: (number | null)[], vj: (number | null)[], formulasUI: string[], formulasVJ: string[] } {
  
  const ui: (number | null)[] = Array(problema.filas).fill(null);
  const vj: (number | null)[] = Array(problema.columnas).fill(null);
  const formulasUI: string[] = Array(problema.filas).fill('');
  const formulasVJ: string[] = Array(problema.columnas).fill('');
  
  // Empiezo asignando u1 = 0 (primera fila)
  ui[0] = 0;
  formulasUI[0] = 'u₁ = 0 (valor inicial)';
  
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
            formulasVJ[j] = `v${j + 1} = C${i + 1}${j + 1} - u${i + 1} = ${costo} - ${ui[i]} = ${vj[j]}`;
            cambios = true;
          }
          // Si conozco vj, puedo calcular ui
          else if (vj[j] !== null && ui[i] === null) {
            ui[i] = costo - vj[j]!;
            formulasUI[i] = `u${i + 1} = C${i + 1}${j + 1} - v${j + 1} = ${costo} - ${vj[j]} = ${ui[i]}`;
            cambios = true;
          }
        }
      }
    }
  }
  
  return { ui, vj, formulasUI, formulasVJ };
}

/**
 * Calcula los costos reducidos para todas las celdas
 * Fórmula: Ui + Vj - Cij (cambio de fórmula según requerimiento)
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
      // Para celdas no básicas, calculo las variables no básicas
      if (!solucion[i][j].esBasica) {
        const uiVal = ui[i] ?? 0;
        const vjVal = vj[j] ?? 0;
        // Fórmula: Ui + Vj - Cij
        costosReducidos[i][j] = uiVal + vjVal - solucion[i][j].costo;
      }
    }
  }
  
  return costosReducidos;
}

/**
 * Verifica si la solución es óptima
 * La solución es óptima si todas las variables no básicas son <= 0
 * Buscamos el valor más positivo (theta) para mejorar
 */
function verificarOptimalidad(
  costosReducidos: number[][],
  solucion: Celda[][]
): { esOptima: boolean, celdaMejora: { fila: number, columna: number } | null } {
  
  let maxCostoReducido = 0;
  let celdaMejora: { fila: number, columna: number } | null = null;
  
  for (let i = 0; i < costosReducidos.length; i++) {
    for (let j = 0; j < costosReducidos[i].length; j++) {
      // Busco el valor MÁS POSITIVO (theta)
      if (!solucion[i][j].esBasica && costosReducidos[i][j] > maxCostoReducido) {
        maxCostoReducido = costosReducidos[i][j];
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
