// EntradaMatrizModal.tsx
// Modal para ingresar o editar la matriz de costos, oferta y demanda

import { useState, useEffect } from 'react';
import type { ProblemaTransporte } from '../tipos/tipos';

// Propiedades del componente
interface EntradaMatrizModalProps {
  mostrar: boolean;                                           // Si el modal está visible
  onCerrar: () => void;                                      // Función para cerrar el modal
  onProblemaCreado: (problema: ProblemaTransporte) => void;  // Función cuando creo/edito el problema
  problemaActual?: ProblemaTransporte | null;                // Problema actual (si estoy editando)
}

/**
 * Modal para configurar el problema de transporte
 * Permite crear o editar la matriz, oferta, demanda y nombres
 */
export function EntradaMatrizModal({ mostrar, onCerrar, onProblemaCreado, problemaActual }: EntradaMatrizModalProps) {

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

  // Si hay un problema actual, cargo sus datos
  useEffect(() => {
    if (problemaActual) {
      setFilas(problemaActual.filas);
      setColumnas(problemaActual.columnas);
      setCostos(problemaActual.costos.map(fila => [...fila]));
      setOferta([...problemaActual.oferta]);
      setDemanda([...problemaActual.demanda]);
      setNombresOrigenes([...problemaActual.nombresOrigenes]);
      setNombresDestinos([...problemaActual.nombresDestinos]);
    }
  }, [problemaActual, mostrar]);

  /**
   * Cuando cambio el número de filas, ajusto mis arrays
   */
  const handleFilasChange = (nuevasFilas: number) => {
    if (nuevasFilas < 2 || nuevasFilas > 10) return;

    setFilas(nuevasFilas);

    const nuevosCostos = Array(nuevasFilas).fill(null).map((_, i) =>
      Array(columnas).fill(null).map((_, j) => costos[i]?.[j] ?? 0)
    );
    setCostos(nuevosCostos);

    const nuevaOferta = Array(nuevasFilas).fill(null).map((_, i) => oferta[i] ?? 0);
    setOferta(nuevaOferta);

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

    const nuevosCostos = Array(filas).fill(null).map((_, i) =>
      Array(nuevasColumnas).fill(null).map((_, j) => costos[i]?.[j] ?? 0)
    );
    setCostos(nuevosCostos);

    const nuevaDemanda = Array(nuevasColumnas).fill(null).map((_, i) => demanda[i] ?? 0);
    setDemanda(nuevaDemanda);

    const nuevosNombres = Array(nuevasColumnas).fill(null).map((_, i) =>
      nombresDestinos[i] ?? `Destino ${i + 1}`
    );
    setNombresDestinos(nuevosNombres);
  };

  /**
   * Actualizo un costo específico en la matriz
   */
  const handleCostoChange = (fila: number, columna: number, valor: string) => {
    const nuevosCostos = costos.map(f => [...f]);
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
   * Actualizo el nombre de un origen
   */
  const handleNombreOrigenChange = (fila: number, valor: string) => {
    const nuevosNombres = [...nombresOrigenes];
    nuevosNombres[fila] = valor || `Origen ${fila + 1}`;
    setNombresOrigenes(nuevosNombres);
  };

  /**
   * Actualizo el nombre de un destino
   */
  const handleNombreDestinoChange = (columna: number, valor: string) => {
    const nuevosNombres = [...nombresDestinos];
    nuevosNombres[columna] = valor || `Destino ${columna + 1}`;
    setNombresDestinos(nuevosNombres);
  };

  /**
   * Valido y creo el problema de transporte
   */
  const handleCrearProblema = () => {
    const totalOferta = oferta.reduce((sum, val) => sum + val, 0);
    const totalDemanda = demanda.reduce((sum, val) => sum + val, 0);

    if (totalOferta !== totalDemanda) {
      alert(`Error: La oferta total (${totalOferta}) debe ser igual a la demanda total (${totalDemanda})`);
      return;
    }

    const hayNegativos = costos.some(fila => fila.some(val => val < 0)) ||
      oferta.some(val => val < 0) ||
      demanda.some(val => val < 0);

    if (hayNegativos) {
      alert('Error: No puede haber valores negativos');
      return;
    }

    const problema: ProblemaTransporte = {
      costos: costos.map(fila => [...fila]),
      oferta: [...oferta],
      demanda: [...demanda],
      filas,
      columnas,
      nombresOrigenes: [...nombresOrigenes],
      nombresDestinos: [...nombresDestinos]
    };

    onProblemaCreado(problema);
    onCerrar();
  };

  /**
   * Cargo un ejemplo predefinido
   */
  const cargarEjemplo = (numeroEjemplo: number) => {
    if (numeroEjemplo === 1) {
      setFilas(3);
      setColumnas(3);
      setCostos([[0, 2, 1], [2, 1, 5], [2, 4, 3]]);
      setOferta([6, 7, 7]);
      setDemanda([5, 5, 10]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else if (numeroEjemplo === 2) {
      setFilas(3);
      setColumnas(3);
      setCostos([[1, 2, 6], [0, 4, 2], [3, 1, 5]]);
      setOferta([7, 12, 11]);
      setDemanda([10, 10, 10]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else if (numeroEjemplo === 3) {
      setFilas(3);
      setColumnas(3);
      setCostos([[5, 1, 8], [2, 4, 0], [3, 6, 7]]);
      setOferta([12, 14, 4]);
      setDemanda([9, 10, 11]);
      setNombresOrigenes(['Origen 1', 'Origen 2', 'Origen 3']);
      setNombresDestinos(['Destino 1', 'Destino 2', 'Destino 3']);
    } else {
      setFilas(3);
      setColumnas(4);
      setCostos([[10, 2, 20, 11], [12, 7, 9, 20], [4, 14, 16, 18]]);
      setOferta([15, 25, 10]);
      setDemanda([5, 15, 15, 15]);
      setNombresOrigenes(['Silo 1', 'Silo 2', 'Silo 3']);
      setNombresDestinos(['Molino 1', 'Molino 2', 'Molino 3', 'Molino 4']);
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white p-2 p-md-3">
            <h5 className="modal-title fs-6 fs-md-5">
              📊 {problemaActual ? 'Editar' : 'Configurar'} Problema
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCerrar}></button>
          </div>

          <div className="modal-body p-2 p-md-3">
            {/* Controles de tamaño */}
            <div className="row g-2 mb-3">
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold small">
                  <span className="d-none d-sm-inline">Orígenes (Filas):</span>
                  <span className="d-inline d-sm-none">Orígenes:</span>
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min="2"
                  max="10"
                  value={filas}
                  onChange={(e) => handleFilasChange(parseInt(e.target.value) || 2)}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold small">
                  <span className="d-none d-sm-inline">Destinos (Columnas):</span>
                  <span className="d-inline d-sm-none">Destinos:</span>
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min="2"
                  max="10"
                  value={columnas}
                  onChange={(e) => handleColumnasChange(parseInt(e.target.value) || 2)}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold small">Cargar Ejemplo:</label>
                <div className="btn-group w-100" role="group">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cargarEjemplo(1)}>
                    <span className="d-none d-sm-inline">Ejemplo A</span>
                    <span className="d-inline d-sm-none">A</span>
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cargarEjemplo(2)}>
                    <span className="d-none d-sm-inline">Ejemplo B</span>
                    <span className="d-inline d-sm-none">B</span>
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cargarEjemplo(3)}>
                    <span className="d-none d-sm-inline">Ejemplo C</span>
                    <span className="d-inline d-sm-none">C</span>
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => cargarEjemplo(4)}>
                    <span className="d-none d-sm-inline">Silos-Molinos</span>
                    <span className="d-inline d-sm-none">S-M</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0" style={{ fontSize: 'clamp(0.65rem, 2vw, 0.875rem)' }}>
                <thead className="table-primary">
                  <tr>
                    <th className="text-center p-1 p-md-2 align-middle">
                      <span className="d-none d-sm-inline">Origen \ Destino</span>
                      <span className="d-inline d-sm-none">O\D</span>
                    </th>
                    {Array(columnas).fill(null).map((_, j) => (
                      <th key={j} className="p-1">
                        <input
                          type="text"
                          className="form-control form-control-sm text-center fw-bold"
                          style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)' }}
                          value={nombresDestinos[j]}
                          onChange={(e) => handleNombreDestinoChange(j, e.target.value)}
                          placeholder={`D${j + 1}`}
                        />
                      </th>
                    ))}
                    <th className="text-center bg-warning p-1 p-md-2">
                      <span className="d-none d-sm-inline">Oferta</span>
                      <span className="d-inline d-sm-none">Ofe.</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array(filas).fill(null).map((_, i) => (
                    <tr key={i}>
                      <td className="p-1 bg-light">
                        <input
                          type="text"
                          className="form-control form-control-sm fw-bold"
                          style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)' }}
                          value={nombresOrigenes[i]}
                          onChange={(e) => handleNombreOrigenChange(i, e.target.value)}
                          placeholder={`O${i + 1}`}
                        />
                      </td>
                      {Array(columnas).fill(null).map((_, j) => (
                        <td key={j} className="p-1">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)', padding: 'clamp(0.2rem, 0.5vw, 0.35rem)' }}
                            value={costos[i][j]}
                            onChange={(e) => handleCostoChange(i, j, e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </td>
                      ))}
                      <td className="p-1 bg-warning bg-opacity-25">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center fw-bold"
                          style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)', padding: 'clamp(0.2rem, 0.5vw, 0.35rem)' }}
                          value={oferta[i]}
                          onChange={(e) => handleOfertaChange(i, e.target.value)}
                          min="0"
                          step="1"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="table-success">
                    <td className="text-center fw-bold p-1 p-md-2">
                      <span className="d-none d-sm-inline">Demanda</span>
                      <span className="d-inline d-sm-none">Dem.</span>
                    </td>
                    {Array(columnas).fill(null).map((_, j) => (
                      <td key={j} className="p-1">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center fw-bold"
                          style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)', padding: 'clamp(0.2rem, 0.5vw, 0.35rem)' }}
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

            {/* Resumen */}
            <div className="alert alert-info mt-2 mb-0 p-2 p-md-3">
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2">
                <span><strong>Total Oferta:</strong> {oferta.reduce((sum, val) => sum + val, 0)}</span>
                <span className="d-none d-sm-inline">|</span>
                <span><strong>Total Demanda:</strong> {demanda.reduce((sum, val) => sum + val, 0)}</span>
                {oferta.reduce((sum, val) => sum + val, 0) === demanda.reduce((sum, val) => sum + val, 0) ?
                  <span className="text-success fw-bold">✓ Balanceado</span> :
                  <span className="text-danger fw-bold">✗ No balanceado</span>
                }
              </div>
            </div>
          </div>

          <div className="modal-footer p-2 p-md-3">
            <button className="btn btn-secondary btn-sm" onClick={onCerrar}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={handleCrearProblema}>
              {problemaActual ? 'Guardar Cambios' : 'Crear Problema'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
