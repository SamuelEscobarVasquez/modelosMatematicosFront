// VisualizadorMatriz.tsx
// Este componente muestra la matriz de solución de forma visual y clara

import type { Celda } from '../tipos/tipos';

// Propiedades que recibe el componente
interface VisualizadorMatrizProps {
  matriz: Celda[][];           // La matriz a mostrar
  oferta: number[];            // Oferta de cada origen
  demanda: number[];           // Demanda de cada destino
  titulo: string;              // Título de la visualización
  mostrarCostoTotal?: boolean; // Si debo mostrar el costo total
  ui?: (number | null)[];      // Multiplicadores ui (opcional)
  vj?: (number | null)[];      // Multiplicadores vj (opcional)
  costosReducidos?: number[][]; // Costos reducidos (opcional)
}

/**
 * Componente que visualiza una matriz de transporte con sus asignaciones
 * Muestra costos, asignaciones, oferta, demanda y opcionalmente multiplicadores
 */
export function VisualizadorMatriz({ 
  matriz, 
  oferta, 
  demanda, 
  titulo, 
  mostrarCostoTotal = false,
  ui,
  vj,
  costosReducidos
}: VisualizadorMatrizProps) {
  
  /**
   * Calculo el costo total de la solución actual
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
  
  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">{titulo}</h4>
        
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th className="text-center">O \ D</th>
                {demanda.map((_, j) => (
                  <th key={j} className="text-center">D{j + 1}</th>
                ))}
                <th className="text-center bg-warning">Oferta</th>
                {ui && <th className="text-center bg-info bg-opacity-25">ui</th>}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, i) => (
                <tr key={i}>
                  <td className="text-center fw-bold bg-light">O{i + 1}</td>
                  {/* Celdas con costos y asignaciones */}
                  {fila.map((celda, j) => (
                    <td 
                      key={j} 
                      className={`text-center ${celda.esBasica ? 'table-success' : ''}`}
                      style={{ position: 'relative', padding: '8px' }}
                    >
                      {/* Muestro el costo en la esquina superior izquierda */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '2px', 
                        left: '4px', 
                        fontSize: '0.75rem',
                        color: '#666'
                      }}>
                        {celda.costo}
                      </div>
                      
                      {/* Muestro la asignación en el centro, solo si es > 0 */}
                      <div style={{ 
                        marginTop: '12px',
                        fontSize: '1.1rem',
                        fontWeight: celda.esBasica ? 'bold' : 'normal'
                      }}>
                        {celda.asignacion > 0 ? celda.asignacion : '-'}
                      </div>
                      
                      {/* Muestro el costo reducido si está disponible */}
                      {costosReducidos && !celda.esBasica && (
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '2px', 
                          right: '4px', 
                          fontSize: '0.7rem',
                          color: costosReducidos[i][j] < 0 ? 'red' : 'green',
                          fontWeight: 'bold'
                        }}>
                          ({costosReducidos[i][j].toFixed(1)})
                        </div>
                      )}
                    </td>
                  ))}
                  
                  {/* Celda de oferta */}
                  <td className="text-center fw-bold bg-warning bg-opacity-25">
                    {oferta[i]}
                  </td>
                  
                  {/* Celda de ui */}
                  {ui && (
                    <td className="text-center fw-bold bg-info bg-opacity-25">
                      {ui[i] !== null ? ui[i] : '-'}
                    </td>
                  )}
                </tr>
              ))}
              
              {/* Fila de demanda */}
              <tr className="table-success">
                <td className="text-center fw-bold">Demanda</td>
                {demanda.map((val, j) => (
                  <td key={j} className="text-center fw-bold">{val}</td>
                ))}
                <td className="bg-light"></td>
                {ui && <td className="bg-light"></td>}
              </tr>
              
              {/* Fila de vj si está disponible */}
              {vj && (
                <tr className="table-info">
                  <td className="text-center fw-bold">vj</td>
                  {vj.map((val, j) => (
                    <td key={j} className="text-center fw-bold">
                      {val !== null ? val : '-'}
                    </td>
                  ))}
                  <td className="bg-light"></td>
                  <td className="bg-light"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Muestro el costo total si se solicita */}
        {mostrarCostoTotal && (
          <div className="alert alert-success mt-3">
            <strong>💰 Costo Total: </strong>
            <span className="fs-4">{calcularCostoTotal().toFixed(2)}</span>
          </div>
        )}
        
        {/* Leyenda */}
        <div className="mt-3">
          <small className="text-muted">
            <strong>Leyenda:</strong> 
            <span className="ms-2">Número superior izquierdo = Costo unitario</span> |
            <span className="ms-2">Número central = Cantidad asignada</span> |
            <span className="ms-2 text-success">Verde = Celda básica (en uso)</span>
            {costosReducidos && <span className="ms-2">| Número inferior derecho = Costo reducido</span>}
          </small>
        </div>
      </div>
    </div>
  );
}
