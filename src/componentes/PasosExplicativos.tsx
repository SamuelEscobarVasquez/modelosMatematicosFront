// PasosExplicativos.tsx
// Componente que muestra la solución paso a paso del método MODI

import { useState } from 'react';
import type { PasoExplicacion } from '../tipos/tipos';
import { VisualizadorMatriz } from './VisualizadorMatriz';

// Propiedades del componente
interface PasosExplicativosProps {
  pasos: PasoExplicacion[];    // Array con todos los pasos de la solución
  oferta: number[];            // Oferta del problema
  demanda: number[];           // Demanda del problema
}

/**
 * Componente que muestra la solución paso a paso
 * Permite navegar entre los diferentes pasos del método MODI
 */
export function PasosExplicativos({ pasos, oferta, demanda }: PasosExplicativosProps) {
  
  // Estado para controlar qué paso estoy mostrando
  const [pasoActual, setPasoActual] = useState<number>(0);
  
  // Obtengo el paso actual
  const paso = pasos[pasoActual];
  
  /**
   * Navego al paso anterior
   */
  const irPasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };
  
  /**
   * Navego al paso siguiente
   */
  const irPasoSiguiente = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    }
  };
  
  /**
   * Obtengo el color del badge según el tipo de paso
   */
  const obtenerColorBadge = (tipo: string): string => {
    switch (tipo) {
      case 'inicial': return 'bg-primary';
      case 'calcular-ui-vj': return 'bg-info';
      case 'calcular-costos-reducidos': return 'bg-warning';
      case 'verificar-optimalidad': return 'bg-success';
      case 'mejorar-solucion': return 'bg-danger';
      case 'final': return 'bg-success';
      default: return 'bg-secondary';
    }
  };
  
  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="card-title text-primary mb-4">
          📚 Explicación Paso a Paso
        </h4>
        
        {/* Controles de navegación superiores */}
        <div className="row mb-4">
          <div className="col-md-4">
            <button 
              className="btn btn-outline-primary w-100"
              onClick={irPasoAnterior}
              disabled={pasoActual === 0}
            >
              ← Anterior
            </button>
          </div>
          
          <div className="col-md-4 text-center">
            <div className="fs-5 fw-bold">
              Paso {pasoActual + 1} de {pasos.length}
            </div>
            <div className="progress mt-2">
              <div 
                className="progress-bar"
                role="progressbar"
                style={{ width: `${((pasoActual + 1) / pasos.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="col-md-4">
            <button 
              className="btn btn-outline-primary w-100"
              onClick={irPasoSiguiente}
              disabled={pasoActual === pasos.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </div>
        
        {/* Información del paso actual */}
        <div className="alert alert-light border">
          <div className="d-flex align-items-center mb-2">
            <span className={`badge ${obtenerColorBadge(paso.tipo)} me-2`}>
              {paso.tipo}
            </span>
            <h5 className="mb-0">{paso.titulo}</h5>
          </div>
          
          <p className="mb-0 mt-2">{paso.descripcion}</p>
        </div>
        
        {/* Visualización de la matriz si está disponible */}
        {paso.matriz && (
          <VisualizadorMatriz
            matriz={paso.matriz}
            oferta={oferta}
            demanda={demanda}
            titulo="Estado de la Matriz"
            mostrarCostoTotal={true}
            ui={paso.ui}
            vj={paso.vj}
            costosReducidos={paso.costosReducidos}
          />
        )}
        
        {/* Información adicional según el tipo de paso */}
        {paso.tipo === 'calcular-ui-vj' && paso.ui && paso.vj && (
          <div className="alert alert-info mt-3">
            <h6>📊 Multiplicadores Calculados:</h6>
            <div className="row">
              <div className="col-md-6">
                <strong>Valores ui (filas):</strong>
                <ul className="mb-0">
                  {paso.ui.map((val, i) => (
                    <li key={i}>u{i + 1} = {val !== null ? val : 'pendiente'}</li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <strong>Valores vj (columnas):</strong>
                <ul className="mb-0">
                  {paso.vj.map((val, j) => (
                    <li key={j}>v{j + 1} = {val !== null ? val : 'pendiente'}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {paso.tipo === 'mejorar-solucion' && paso.celdaMejora && (
          <div className="alert alert-warning mt-3">
            <h6>🔄 Mejorando la Solución:</h6>
            <p>
              Encontré que la celda en posición ({paso.celdaMejora.fila + 1}, {paso.celdaMejora.columna + 1}) 
              tiene un costo reducido negativo, lo que significa que puedo mejorar mi solución 
              si asigno cantidad a esta celda.
            </p>
            {paso.ciclo && paso.ciclo.length > 0 && (
              <>
                <p><strong>Ciclo formado:</strong></p>
                <p className="mb-0">
                  {paso.ciclo.map((celda, idx) => (
                    <span key={idx}>
                      ({celda.fila + 1}, {celda.columna + 1})
                      {idx < paso.ciclo!.length - 1 ? ' → ' : ''}
                    </span>
                  ))}
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Controles de navegación inferiores */}
        <div className="row mt-4">
          <div className="col-md-6">
            <button 
              className="btn btn-secondary w-100"
              onClick={irPasoAnterior}
              disabled={pasoActual === 0}
            >
              ← Paso Anterior
            </button>
          </div>
          
          <div className="col-md-6">
            <button 
              className="btn btn-primary w-100"
              onClick={irPasoSiguiente}
              disabled={pasoActual === pasos.length - 1}
            >
              Paso Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
