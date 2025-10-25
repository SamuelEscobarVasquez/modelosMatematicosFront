// tipos.ts
// Este archivo contiene todas las definiciones de tipos que voy a usar en mi aplicación
// Esto me ayuda a mantener el código organizado y evitar errores

// Defino los tipos de métodos iniciales que puedo usar para encontrar una solución inicial
export type MetodoInicial = 'esquina-noroeste' | 'costo-minimo' | 'vogel';

// Esta es la estructura de mi celda en la matriz de transporte
// Cada celda tiene un costo, una asignación (cantidad transportada) y si está siendo usada
export interface Celda {
  costo: number;              // El costo de transportar de origen i a destino j
  asignacion: number;         // La cantidad que voy a transportar
  esBasica: boolean;          // Si esta celda es parte de mi solución básica
}

// Estructura completa del problema de transporte
export interface ProblemaTransporte {
  costos: number[][];         // Matriz de costos de transporte
  oferta: number[];           // Oferta disponible en cada origen
  demanda: number[];          // Demanda requerida en cada destino
  filas: number;              // Número de orígenes
  columnas: number;           // Número de destinos
}

// Estructura para almacenar la solución del problema
export interface Solucion {
  asignaciones: Celda[][];    // Matriz con las asignaciones finales
  costoTotal: number;         // El costo total de mi solución
  esOptima: boolean;          // Si la solución es óptima o no
  metodoUsado: MetodoInicial; // Qué método inicial usé
}

// Paso de la explicación del método MODI
export interface PasoExplicacion {
  tipo: 'inicial' | 'calcular-ui-vj' | 'calcular-costos-reducidos' | 'verificar-optimalidad' | 'mejorar-solucion' | 'final';
  titulo: string;             // Título del paso
  descripcion: string;        // Explicación detallada de lo que hago
  matriz?: Celda[][];         // La matriz en este paso (si aplica)
  ui?: (number | null)[];     // Valores ui para cada fila
  vj?: (number | null)[];     // Valores vj para cada columna
  costosReducidos?: number[][]; // Costos reducidos calculados
  celdaMejora?: {fila: number, columna: number}; // Celda donde voy a mejorar
  ciclo?: {fila: number, columna: number}[];     // El ciclo que formo para mejorar
}
