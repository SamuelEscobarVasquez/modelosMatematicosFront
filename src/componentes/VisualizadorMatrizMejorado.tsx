// VisualizadorMatrizMejorado.tsx
// Componente mejorado para visualizar la matriz con tooltips y ciclos

import type { Celda } from '../tipos/tipos';

// Propiedades del componente
interface VisualizadorMatrizMejoradoProps {
  matriz: Celda[][];
  oferta: number[];
  demanda: number[];
  nombresOrigenes: string[];
  nombresDestinos: string[];
  titulo: string;
  mostrarCostoTotal?: boolean;
  ui?: (number | null)[];
  vj?: (number | null)[];
  variablesNoBasicas?: number[][];
  ciclo?: {fila: number, columna: number}[];
  theta?: number;
}

/**
 * Componente mejorado para visualizar matrices
 * Incluye tooltips explicativos y visualización de ciclos
 */
export function VisualizadorMatrizMejorado({
  matriz,
  oferta,
  demanda,
  nombresOrigenes,
  nombresDestinos,
  titulo,
  mostrarCostoTotal = false,
  ui,
  vj,
  variablesNoBasicas,
  ciclo,
  theta
}: VisualizadorMatrizMejoradoProps) {
  
  /**
   * Calculo el costo total de la solución
   */
  const calcularCostoTotal = (): number => {
    let total = 0;
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        total += matriz[i][j].costo * matriz[i][j].asignacion;
      }
    }
    return total;
  };
  
  /**
   * Verifico si una celda está en el ciclo
   */
  const estaEnCiclo = (fila: number, columna: number): number => {
    if (!ciclo) return -1;
    return ciclo.findIndex(c => c.fila === fila && c.columna === columna);
  };
  
  /**
   * Obtengo la dirección de la flecha en el ciclo
   */
  const obtenerDireccionFlecha = (fila: number, columna: number): string => {
    const indice = estaEnCiclo(fila, columna);
    if (indice === -1 || !ciclo) return '';
    
    const siguiente = ciclo[(indice + 1) % ciclo.length];
    
    if (siguiente.fila === fila && siguiente.columna > columna) return '→';
    if (siguiente.fila === fila && siguiente.columna < columna) return '←';
    if (siguiente.columna === columna && siguiente.fila > fila) return '↓';
    if (siguiente.columna === columna && siguiente.fila < fila) return '↑';
    
    return '';
  };
  
  /**
   * Determino si en el ciclo sumo o resto
   */
  const esPositivoEnCiclo = (fila: number, columna: number): boolean => {
    const indice = estaEnCiclo(fila, columna);
    return indice % 2 === 0; // Par = sumo (+), Impar = resto (-)
  };
  
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title text-primary mb-3">{titulo}</h5>
        
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-primary">
              <tr>
                <th className="text-center align-middle">
                  <span 
                    data-bs-toggle="tooltip" 
                    title="Fila i, Columna j"
                    style={{ cursor: 'help' }}
                  >
                    i \ j
                  </span>
                </th>
                {demanda.map((_, j) => (
                  <th key={j} className="text-center align-middle">
                    <span
                      data-bs-toggle="tooltip"
                      title={`Destino j=${j + 1}: ${nombresDestinos[j]}`}
                      style={{ cursor: 'help' }}
                    >
                      {nombresDestinos[j]}
                    </span>
                  </th>
                ))}
                <th className="text-center bg-warning align-middle">
                  <span
                    data-bs-toggle="tooltip"
                    title="Oferta disponible en cada origen"
                    style={{ cursor: 'help' }}
                  >
                    Oferta
                  </span>
                </th>
                {ui && (
                  <th className="text-center bg-info bg-opacity-25 align-middle">
                    <span
                      data-bs-toggle="tooltip"
                      title="Multiplicadores de fila (ui)"
                      style={{ cursor: 'help' }}
                    >
                      ui
                    </span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, i) => (
                <tr key={i}>
                  <td className="text-center fw-bold bg-light align-middle">
                    <span
                      data-bs-toggle="tooltip"
                      title={`Origen i=${i + 1}: ${nombresOrigenes[i]}`}
                      style={{ cursor: 'help' }}
                    >
                      {nombresOrigenes[i]}
                    </span>
                  </td>
                  
                  {fila.map((celda, j) => {
                    const indiceCiclo = estaEnCiclo(i, j);
                    const enCiclo = indiceCiclo !== -1;
                    const flecha = obtenerDireccionFlecha(i, j);
                    const esPositivo = esPositivoEnCiclo(i, j);
                    
                    return (
                      <td
                        key={j}
                        className={`text-center position-relative ${
                          celda.esBasica ? 'table-success' : ''
                        } ${enCiclo ? 'border-danger border-3' : ''}`}
                        style={{ 
                          padding: '12px 8px',
                          minHeight: '70px',
                          position: 'relative'
                        }}
                      >
                        {/* Costo (esquina superior izquierda) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '6px',
                            fontSize: '0.75rem',
                            color: '#666',
                            cursor: 'help'
                          }}
                          data-bs-toggle="tooltip"
                          title={`Costo C${i + 1}${j + 1} = ${celda.costo} (costo de transportar de ${nombresOrigenes[i]} a ${nombresDestinos[j]})`}
                        >
                          {celda.costo}
                        </div>
                        
                        {/* Asignación (centro) */}
                        <div
                          style={{
                            marginTop: '10px',
                            fontSize: '1.1rem',
                            fontWeight: celda.esBasica ? 'bold' : 'normal',
                            cursor: 'help'
                          }}
                          data-bs-toggle="tooltip"
                          title={
                            celda.asignacion > 0
                              ? `X${i + 1}${j + 1} = ${celda.asignacion} unidades asignadas (${celda.esBasica ? 'Variable Básica' : 'Variable No Básica'})`
                              : 'Sin asignación'
                          }
                        >
                          {celda.asignacion > 0 ? celda.asignacion : '-'}
                        </div>
                        
                        {/* Variable no básica (esquina inferior derecha) */}
                        {variablesNoBasicas && !celda.esBasica && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              right: '6px',
                              fontSize: '0.7rem',
                              color: variablesNoBasicas[i][j] > 0 ? 'red' : 'green',
                              fontWeight: 'bold',
                              cursor: 'help'
                            }}
                            data-bs-toggle="tooltip"
                            title={`Variable no básica: U${i + 1} + V${j + 1} - C${i + 1}${j + 1} = ${
                              ui?.[i] ?? 0
                            } + ${vj?.[j] ?? 0} - ${celda.costo} = ${variablesNoBasicas[i][j].toFixed(1)}`}
                          >
                            ({variablesNoBasicas[i][j].toFixed(1)})
                          </div>
                        )}
                        
                        {/* Indicador de ciclo */}
                        {enCiclo && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '6px',
                              fontSize: '1.2rem',
                              color: '#dc3545',
                              fontWeight: 'bold',
                              cursor: 'help'
                            }}
                            data-bs-toggle="tooltip"
                            title={`Celda ${indiceCiclo + 1} del ciclo ${esPositivo ? '(+θ)' : '(-θ)'} ${flecha}`}
                          >
                            {esPositivo ? '+' : '-'} {flecha}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  
                  {/* Oferta */}
                  <td className="text-center fw-bold bg-warning bg-opacity-25 align-middle">
                    <span
                      data-bs-toggle="tooltip"
                      title={`Oferta total disponible en ${nombresOrigenes[i]}`}
                      style={{ cursor: 'help' }}
                    >
                      {oferta[i]}
                    </span>
                  </td>
                  
                  {/* ui */}
                  {ui && (
                    <td className="text-center fw-bold bg-info bg-opacity-25 align-middle">
                      <span
                        data-bs-toggle="tooltip"
                        title={`Multiplicador de fila u${i + 1}`}
                        style={{ cursor: 'help' }}
                      >
                        {ui[i] !== null ? ui[i] : '-'}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              
              {/* Fila de demanda */}
              <tr className="table-success">
                <td className="text-center fw-bold align-middle">Demanda</td>
                {demanda.map((val, j) => (
                  <td key={j} className="text-center fw-bold align-middle">
                    <span
                      data-bs-toggle="tooltip"
                      title={`Demanda requerida en ${nombresDestinos[j]}`}
                      style={{ cursor: 'help' }}
                    >
                      {val}
                    </span>
                  </td>
                ))}
                <td className="bg-light"></td>
                {ui && <td className="bg-light"></td>}
              </tr>
              
              {/* Fila de vj */}
              {vj && (
                <tr className="table-info">
                  <td className="text-center fw-bold align-middle">vj</td>
                  {vj.map((val, j) => (
                    <td key={j} className="text-center fw-bold align-middle">
                      <span
                        data-bs-toggle="tooltip"
                        title={`Multiplicador de columna v${j + 1}`}
                        style={{ cursor: 'help' }}
                      >
                        {val !== null ? val : '-'}
                      </span>
                    </td>
                  ))}
                  <td className="bg-light"></td>
                  <td className="bg-light"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Costo total */}
        {mostrarCostoTotal && (
          <div className="alert alert-success mt-2 mb-0">
            <strong>💰 Costo Total: </strong>
            <span className="fs-5">${calcularCostoTotal().toFixed(2)}</span>
          </div>
        )}
        
        {/* Información del ciclo */}
        {ciclo && theta !== undefined && (
          <div className="alert alert-warning mt-2 mb-0">
            <strong>🔄 Ciclo de Mejora:</strong> θ (theta) = {theta}
            <br />
            <small>+ = Sumar θ | - = Restar θ | Flechas indican la dirección del ciclo</small>
          </div>
        )}
        
        {/* Leyenda */}
        <div className="mt-2">
          <small className="text-muted">
            <strong>Leyenda:</strong> Superior izq. = Costo (Cij) | Centro = Asignación (Xij) | 
            {variablesNoBasicas && ' Inferior der. = Variable no básica (Ui+Vj-Cij) |'}
            <span className="text-success"> Verde = Variable básica</span>
            {ciclo && <span className="text-danger"> | Borde rojo = En ciclo</span>}
          </small>
        </div>
      </div>
    </div>
  );
}
