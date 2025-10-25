// PasosExplicativosMejorado.tsx
// Componente mejorado para mostrar la solución paso a paso

import { useState, useEffect } from 'react';
import type { PasoExplicacion } from '../tipos/tipos';
import { VisualizadorMatrizMejorado } from './VisualizadorMatrizMejorado';

// Propiedades del componente
interface PasosExplicativosMejoradosProps {
  pasos: PasoExplicacion[];
  oferta: number[];
  demanda: number[];
  nombresOrigenes: string[];
  nombresDestinos: string[];
}

/**
 * Componente mejorado para mostrar pasos explicativos
 * Incluye las fórmulas y explicaciones detalladas
 */
export function PasosExplicativosMejorados({
  pasos,
  oferta,
  demanda,
  nombresOrigenes,
  nombresDestinos
}: PasosExplicativosMejoradosProps) {
  
  const [pasoActual, setPasoActual] = useState<number>(0);
  
  // Inicializo tooltips de Bootstrap cuando cambia el paso
  useEffect(() => {
    // Inicializo tooltips de Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = Array.from(tooltipTriggerList).map(
      (tooltipTriggerEl) => new (window as any).bootstrap.Tooltip(tooltipTriggerEl)
    );
    
    return () => {
      tooltips.forEach(tooltip => tooltip.dispose());
    };
  }, [pasoActual]);
  
  const paso = pasos[pasoActual];
  
  const irPasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };
  
  const irPasoSiguiente = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    }
  };
  
  const obtenerColorBadge = (tipo: string): string => {
    switch (tipo) {
      case 'solucion-inicial': return 'bg-primary';
      case 'calcular-ui-vj': return 'bg-info';
      case 'calcular-variables-no-basicas': return 'bg-warning text-dark';
      case 'verificar-optimalidad': return 'bg-success';
      case 'mejorar-solucion': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">
          📚 Explicación Paso a Paso
        </h4>
        
        {/* Navegación */}
        <div className="row mb-3">
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
            <div className="fs-6 fw-bold">
              Paso {pasoActual + 1} de {pasos.length}
            </div>
            <div className="progress mt-2" style={{ height: '8px' }}>
              <div
                className="progress-bar"
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
        
        {/* Información del paso */}
        <div className="alert alert-light border">
          <div className="d-flex align-items-center mb-2">
            <span className={`badge ${obtenerColorBadge(paso.tipo)} me-2`}>
              {paso.tipo}
            </span>
            <h5 className="mb-0">{paso.titulo}</h5>
          </div>
          <p className="mb-0">{paso.descripcion}</p>
        </div>
        
        {/* Matriz */}
        {paso.matriz && (
          <VisualizadorMatrizMejorado
            matriz={paso.matriz}
            oferta={oferta}
            demanda={demanda}
            nombresOrigenes={nombresOrigenes}
            nombresDestinos={nombresDestinos}
            titulo="Estado de la Matriz"
            mostrarCostoTotal={true}
            ui={paso.ui}
            vj={paso.vj}
            variablesNoBasicas={paso.variablesNoBasicas}
            ciclo={paso.ciclo}
            theta={paso.theta}
          />
        )}
        
        {/* Fórmulas de ui y vj */}
        {paso.tipo === 'calcular-ui-vj' && paso.formulasUI && paso.formulasVJ && (
          <div className="alert alert-info mt-3">
            <h6>📐 Fórmulas para Calcular Multiplicadores:</h6>
            <p className="mb-2">
              <strong>Ecuación base:</strong> Para cada celda básica: <code>ui + vj = Cij</code>
            </p>
            
            <div className="row">
              <div className="col-md-6">
                <strong>Valores ui (multiplicadores de fila):</strong>
                <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                  {paso.formulasUI.map((formula, i) => (
                    formula && <li key={i}><code>{formula}</code></li>
                  ))}
                </ul>
              </div>
              
              <div className="col-md-6">
                <strong>Valores vj (multiplicadores de columna):</strong>
                <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                  {paso.formulasVJ.map((formula, j) => (
                    formula && <li key={j}><code>{formula}</code></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Variables no básicas */}
        {paso.tipo === 'calcular-variables-no-basicas' && paso.variablesNoBasicas && (
          <div className="alert alert-warning">
            <h6>📊 Cálculo de Variables No Básicas:</h6>
            <p>
              <strong>Fórmula:</strong> <code>Ui + Vj - Cij</code>
            </p>
            <p className="mb-0">
              Donde: <strong>i</strong> = número de fila (origen), 
              <strong> j</strong> = número de columna (destino)
            </p>
            <p className="mt-2 mb-0">
              Las variables no básicas me indican si puedo mejorar la solución.
              Si encuentro un valor <strong>positivo</strong>, puedo reducir el costo
              asignando a esa celda.
            </p>
          </div>
        )}
        
        {/* Ciclo de mejora */}
        {paso.tipo === 'mejorar-solucion' && paso.ciclo && paso.theta !== undefined && (
          <div className="alert alert-danger">
            <h6>🔄 Ciclo de Mejora Encontrado:</h6>
            <p>
              <strong>Valor theta (θ):</strong> {paso.theta}
            </p>
            <p>
              <strong>Secuencia del ciclo:</strong>
            </p>
            <div className="bg-white p-2 rounded border">
              {paso.ciclo.map((celda, idx) => (
                <span key={idx} className="me-2">
                  <strong>({celda.fila + 1}, {celda.columna + 1})</strong>
                  {idx % 2 === 0 ? ' [+θ]' : ' [-θ]'}
                  {idx < paso.ciclo!.length - 1 && ' → '}
                </span>
              ))}
            </div>
            <p className="mt-2 mb-0">
              <small>
                En las celdas marcadas con <strong>[+θ]</strong> sumo {paso.theta} unidades.
                En las celdas marcadas con <strong>[-θ]</strong> resto {paso.theta} unidades.
              </small>
            </p>
          </div>
        )}
        
        {/* Navegación inferior */}
        <div className="row mt-3">
          <div className="col-6">
            <button
              className="btn btn-secondary w-100"
              onClick={irPasoAnterior}
              disabled={pasoActual === 0}
            >
              ← Anterior
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-primary w-100"
              onClick={irPasoSiguiente}
              disabled={pasoActual === pasos.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
