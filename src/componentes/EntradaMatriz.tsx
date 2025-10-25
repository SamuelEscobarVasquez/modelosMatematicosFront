// EntradaMatriz.tsx
// Este componente permite al usuario ingresar la matriz de costos, oferta y demanda

import { useState } from 'react';
import type { ProblemaTransporte } from '../tipos/tipos';

// Defino las propiedades que recibe este componente
interface EntradaMatrizProps {
  onProblemaCreado: (problema: ProblemaTransporte) => void; // Función que se llama cuando creo el problema
}

/**
 * Componente para ingresar los datos del problema de transporte
 * Permite crear una matriz dinámica con costos, oferta y demanda
 */
export function EntradaMatriz({ onProblemaCreado }: EntradaMatrizProps) {
  
  // Estado para el tamaño de mi matriz
  const [filas, setFilas] = useState<number>(3);
  const [columnas, setColumnas] = useState<number>(3);
  
  // Estado para los datos del problema
  const [costos, setCostos] = useState<number[][]>(
    Array(3).fill(null).map(() => Array(3).fill(0))
  );
  const [oferta, setOferta] = useState<number[]>(Array(3).fill(0));
  const [demanda, setDemanda] = useState<number[]>(Array(3).fill(0));
  
  // Estado para los nombres personalizados
  const [nombresOrigenes, setNombresOrigenes] = useState<string[]>(
    Array(3).fill(null).map((_, i) => `Origen ${i + 1}`)
  );
  const [nombresDestinos, setNombresDestinos] = useState<string[]>(
    Array(3).fill(null).map((_, i) => `Destino ${i + 1}`)
  );
  
  /**
   * Cuando cambio el número de filas, ajusto mis arrays
   */
  const handleFilasChange = (nuevasFilas: number) => {
    if (nuevasFilas < 2 || nuevasFilas > 10) return;
    
    setFilas(nuevasFilas);
    
    // Ajusto la matriz de costos
    const nuevosCostos = Array(nuevasFilas).fill(null).map((_, i) =>
      Array(columnas).fill(null).map((_, j) => 
        costos[i]?.[j] ?? 0
      )
    );
    setCostos(nuevosCostos);
    
    // Ajusto la oferta
    const nuevaOferta = Array(nuevasFilas).fill(null).map((_, i) => oferta[i] ?? 0);
    setOferta(nuevaOferta);
    
    // Ajusto los nombres de orígenes
    const nuevosNombres = Array(nuevasFilas).fill(null).map((_, i) => 
      nombresOrigenes[i] ?? `Origen ${i + 1}`
    );
    setNombresOrigenes(nuevosNombres);
  };
  
  /**
   * Cuando cambio el número de columnas, ajusto mis arrays
   */
  const handleColumnasChange = (nuevasColumnas: number) => {
    if (nuevasColumnas < 2 || nuevasColumnas > 10) return;
    
    setColumnas(nuevasColumnas);
    
    // Ajusto la matriz de costos
    const nuevosCostos = Array(filas).fill(null).map((_, i) =>
      Array(nuevasColumnas).fill(null).map((_, j) => 
        costos[i]?.[j] ?? 0
      )
    );
    setCostos(nuevosCostos);
    
    // Ajusto la demanda
    const nuevaDemanda = Array(nuevasColumnas).fill(null).map((_, i) => demanda[i] ?? 0);
    setDemanda(nuevaDemanda);
    
    // Ajusto los nombres de destinos
    const nuevosNombres = Array(nuevasColumnas).fill(null).map((_, i) => 
      nombresDestinos[i] ?? `Destino ${i + 1}`
    );
    setNombresDestinos(nuevosNombres);
  };
  
  /**
   * Actualizo un costo específico en la matriz
   */
  const handleCostoChange = (fila: number, columna: number, valor: string) => {
    const nuevosCostos = [...costos];
    nuevosCostos[fila][columna] = parseFloat(valor) || 0;
    setCostos(nuevosCostos);
  };
  
  /**
   * Actualizo un valor de oferta
   */
  const handleOfertaChange = (fila: number, valor: string) => {
    const nuevaOferta = [...oferta];
    nuevaOferta[fila] = parseFloat(valor) || 0;
    setOferta(nuevaOferta);
  };
  
  /**
   * Actualizo un valor de demanda
   */
  const handleDemandaChange = (columna: number, valor: string) => {
    const nuevaDemanda = [...demanda];
    nuevaDemanda[columna] = parseFloat(valor) || 0;
    setDemanda(nuevaDemanda);
  };
  
  /**
   * Valido y creo el problema de transporte
   */
  const handleCrearProblema = () => {
    // Verifico que la oferta total sea igual a la demanda total
    const totalOferta = oferta.reduce((sum, val) => sum + val, 0);
    const totalDemanda = demanda.reduce((sum, val) => sum + val, 0);
    
    if (totalOferta !== totalDemanda) {
      alert(`Error: La oferta total (${totalOferta}) debe ser igual a la demanda total (${totalDemanda})`);
      return;
    }
    
    // Verifico que no haya valores negativos
    const hayNegativos = costos.some(fila => fila.some(val => val < 0)) ||
                         oferta.some(val => val < 0) ||
                         demanda.some(val => val < 0);
    
    if (hayNegativos) {
      alert('Error: No puede haber valores negativos');
      return;
    }
    
    // Creo el problema y lo envío al componente padre
    const problema: ProblemaTransporte = {
      costos,
      oferta,
      demanda,
      filas,
      columnas,
      nombresOrigenes,
      nombresDestinos
    };
    
    onProblemaCreado(problema);
  };
  
  /**
   * Cargo un ejemplo predefinido para que sea más fácil probar
   * Los ejemplos están basados en la imagen proporcionada
   */
  const cargarEjemplo = (numeroEjemplo: number) => {
    if (numeroEjemplo === 1) {
      // Ejemplo (a) de la imagen
      setFilas(3);
      setColumnas(3);
      setCostos([
        [0, 2, 1],
        [2, 1, 5],
        [2, 4, 3]
      ]);
      setOferta([6, 7, 7]);
      setDemanda([5, 5, 10]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else if (numeroEjemplo === 2) {
      // Ejemplo (b) de la imagen
      setFilas(3);
      setColumnas(3);
      setCostos([
        [1, 2, 6],
        [0, 4, 2],
        [3, 1, 5]
      ]);
      setOferta([7, 12, 11]);
      setDemanda([10, 10, 10]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else if (numeroEjemplo === 3) {
      // Ejemplo (c) de la imagen
      setFilas(3);
      setColumnas(3);
      setCostos([
        [5, 1, 8],
        [2, 4, 0],
        [3, 6, 7]
      ]);
      setOferta([12, 14, 4]);
      setDemanda([9, 10, 11]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else {
      // Ejemplo del problema con Silos y Molinos de la imagen
      setFilas(3);
      setColumnas(4);
      setCostos([
        [10, 2, 20, 11],
        [12, 7, 9, 20],
        [4, 14, 16, 18]
      ]);
      setOferta([15, 25, 10]);
      setDemanda([5, 15, 15, 15]);
      setNombresOrigenes(['Silo 1', 'Silo 2', 'Silo 3']);
      setNombresDestinos(['Molino 1', 'Molino 2', 'Molino 3', 'Molino 4']);
    }
  };
  
  return (
    <div className="card shadow">
      <div className="card-body">
        <h3 className="card-title mb-4">
          📊 Configuración del Problema de Transporte
        </h3>
        
        {/* Controles para el tamaño de la matriz */}
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label fw-bold">Orígenes (Filas):</label>
            <input
              type="number"
              className="form-control"
              min="2"
              max="10"
              value={filas}
              onChange={(e) => handleFilasChange(parseInt(e.target.value) || 2)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Destinos (Columnas):</label>
            <input
              type="number"
              className="form-control"
              min="2"
              max="10"
              value={columnas}
              onChange={(e) => handleColumnasChange(parseInt(e.target.value) || 2)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="dropdown w-100">
              <button 
                className="btn btn-secondary w-100 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                📝 Cargar Ejemplo
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); cargarEjemplo(1); }}>Ejemplo (a)</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); cargarEjemplo(2); }}>Ejemplo (b)</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); cargarEjemplo(3); }}>Ejemplo (c)</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); cargarEjemplo(4); }}>Silos y Molinos</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Tabla para ingresar costos, oferta y demanda */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th className="text-center">Origen \ Destino</th>
                {Array(columnas).fill(null).map((_, j) => (
                  <th key={j} className="text-center">D{j + 1}</th>
                ))}
                <th className="text-center bg-warning">Oferta</th>
              </tr>
            </thead>
            <tbody>
              {Array(filas).fill(null).map((_, i) => (
                <tr key={i}>
                  <td className="text-center fw-bold bg-light">O{i + 1}</td>
                  {/* Celdas de costos */}
                  {Array(columnas).fill(null).map((_, j) => (
                    <td key={j} className="p-1">
                      <input
                        type="number"
                        className="form-control form-control-sm text-center"
                        value={costos[i][j]}
                        onChange={(e) => handleCostoChange(i, j, e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </td>
                  ))}
                  {/* Celda de oferta */}
                  <td className="p-1 bg-warning bg-opacity-25">
                    <input
                      type="number"
                      className="form-control form-control-sm text-center fw-bold"
                      value={oferta[i]}
                      onChange={(e) => handleOfertaChange(i, e.target.value)}
                      min="0"
                      step="1"
                    />
                  </td>
                </tr>
              ))}
              {/* Fila de demanda */}
              <tr className="table-success">
                <td className="text-center fw-bold">Demanda</td>
                {Array(columnas).fill(null).map((_, j) => (
                  <td key={j} className="p-1">
                    <input
                      type="number"
                      className="form-control form-control-sm text-center fw-bold"
                      value={demanda[j]}
                      onChange={(e) => handleDemandaChange(j, e.target.value)}
                      min="0"
                      step="1"
                    />
                  </td>
                ))}
                <td className="bg-light"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Resumen de totales */}
        <div className="alert alert-info mb-3">
          <strong>Total Oferta:</strong> {oferta.reduce((sum, val) => sum + val, 0)} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Total Demanda:</strong> {demanda.reduce((sum, val) => sum + val, 0)}
          {oferta.reduce((sum, val) => sum + val, 0) === demanda.reduce((sum, val) => sum + val, 0) ? 
            <span className="text-success"> ✓ Balanceado</span> : 
            <span className="text-danger"> ✗ No balanceado</span>
          }
        </div>
        
        {/* Botón para resolver */}
        <button 
          className="btn btn-primary btn-lg w-100"
          onClick={handleCrearProblema}
        >
          🚀 Resolver Problema
        </button>
      </div>
    </div>
  );
}
