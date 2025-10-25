// SelectorMetodo.tsx
// Componente que permite al usuario elegir el método inicial a utilizar

import type { MetodoInicial } from '../tipos/tipos';

// Propiedades del componente
interface SelectorMetodoProps {
  onMetodoSeleccionado: (metodo: MetodoInicial) => void; // Función cuando selecciono un método
  metodoActual: MetodoInicial | null;                    // El método actualmente seleccionado
}

/**
 * Componente para seleccionar el método inicial de solución
 * Ofrece dos opciones: Esquina Noroeste y Costo Mínimo
 */
export function SelectorMetodo({ onMetodoSeleccionado, metodoActual }: SelectorMetodoProps) {
  
  // Información sobre cada método
  const metodos: {
    id: MetodoInicial;
    nombre: string;
    descripcion: string;
    icono: string;
    nivel: string;
  }[] = [
    {
      id: 'esquina-noroeste',
      nombre: 'Esquina Noroeste',
      descripcion: 'El método más simple. Empiezo desde la esquina superior izquierda y voy asignando la máxima cantidad posible.',
      icono: '↖️',
      nivel: 'Básico'
    },
    {
      id: 'costo-minimo',
      nombre: 'Costo Mínimo',
      descripcion: 'Método que asigna primero a las celdas con menor costo, buscando minimizar el costo total desde el inicio.',
      icono: '💰',
      nivel: 'Intermedio'
    }
  ];
  
  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <h4 className="card-title mb-4">🔧 Selecciona el Método Inicial</h4>
        
        <p className="text-muted mb-4">
          Elige el método que usaré para encontrar una solución inicial. 
          Luego optimizaré esa solución usando el Método de Multiplicadores.
        </p>
        
        <div className="row justify-content-center">
          {metodos.map((metodo) => (
            <div key={metodo.id} className="col-md-5 mb-3">
              <div 
                className={`card h-100 ${metodoActual === metodo.id ? 'border-primary border-3' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => onMetodoSeleccionado(metodo.id)}
              >
                <div className="card-body">
                  <div className="text-center mb-3" style={{ fontSize: '3rem' }}>
                    {metodo.icono}
                  </div>
                  
                  <h5 className="card-title text-center">
                    {metodo.nombre}
                  </h5>
                  
                  <p className="text-center mb-2">
                    <span className={`badge ${
                      metodo.nivel === 'Básico' ? 'bg-success' :
                      metodo.nivel === 'Intermedio' ? 'bg-warning' :
                      'bg-danger'
                    }`}>
                      {metodo.nivel}
                    </span>
                  </p>
                  
                  <p className="card-text text-muted small">
                    {metodo.descripcion}
                  </p>
                  
                  {metodoActual === metodo.id && (
                    <div className="text-center mt-3">
                      <span className="badge bg-primary">✓ Seleccionado</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
