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

export interface EtiquetaDistribuida {
  x: number;
  y: number;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private mmToPx(mm: number): number {
    return (mm * 96) / 25.4;
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

  calcularDistribucionImpresion(
    config: PrintConfig,
    etiquetaUrl: string
  ): { etiquetas: EtiquetaDistribuida[]; width: number; height: number } {
    const hojaSize = this.getHojaSize(config);
    const hojaPxWidth = this.mmToPx(hojaSize.width);
    const hojaPxHeight = this.mmToPx(hojaSize.height);

    const etiquetaWidth = config.etiquetaSize.width;
    const etiquetaHeight = config.etiquetaSize.height;

    const margin = this.mmToPx(10); // margen fijo de 10mm

    const cols = Math.floor((hojaPxWidth - 2 * margin) / etiquetaWidth);
    const rows = Math.floor((hojaPxHeight - 2 * margin) / etiquetaHeight);

    const etiquetas: EtiquetaDistribuida[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        etiquetas.push({
          x: margin + c * etiquetaWidth,
          y: margin + r * etiquetaHeight,
          url: etiquetaUrl
        });
      }
    }

    return {
      etiquetas,
      width: hojaPxWidth,
      height: hojaPxHeight
    };
  }
}

