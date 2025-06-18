import { Injectable } from '@angular/core';
import { PrintConfig } from '../models/print-config';

export interface HojaSize {
  width: number; // mm
  height: number; // mm
}

export interface EtiquetaSize {
  width: number; // px
  height: number; // px
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private readonly PX_TO_MM = 0.2646;

  calcularDistribucionImpresion(
    hoja: HojaSize,
    etiqueta: EtiquetaSize
  ): {
    filas: number;
    columnas: number;
    margenHorizontal: number;
    margenVertical: number;
    etiquetas: { x: number; y: number }[];
  } {
    const etiquetaWidthMM = etiqueta.width * this.PX_TO_MM;
    const etiquetaHeightMM = etiqueta.height * this.PX_TO_MM;

    const columnas = Math.floor(hoja.width / etiquetaWidthMM);
    const filas = Math.floor(hoja.height / etiquetaHeightMM);

    const sobranteHorizontal = hoja.width - (columnas * etiquetaWidthMM);
    const sobranteVertical = hoja.height - (filas * etiquetaHeightMM);

    const margenHorizontal = sobranteHorizontal / 2;
    const margenVertical = sobranteVertical / 2;

    const etiquetas: { x: number; y: number }[] = [];

    for (let fila = 0; fila < filas; fila++) {
      for (let col = 0; col < columnas; col++) {
        etiquetas.push({
          x: margenHorizontal + col * etiquetaWidthMM,
          y: margenVertical + fila * etiquetaHeightMM
        });
      }
    }

    return {
      filas,
      columnas,
      margenHorizontal,
      margenVertical,
      etiquetas
    };
  }

  getHojaSize(config: PrintConfig): HojaSize {
    switch (config.hoja) {
      case 'A4':
        return { width: 210, height: 297 }; // mm
      case 'Letter':
        return { width: 216, height: 279 }; // mm
      case 'personalizado':
        return {
          width: config.anchoPersonalizado ?? 210,
          height: config.altoPersonalizado ?? 297
        };
      default:
        return { width: 210, height: 297 };
    }
  }

}

