import { Injectable } from '@angular/core';
import { PrintConfig } from '../models/print-config';

export interface HojaSize {
  width: number; // cm
  height: number; // cm
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
  providedIn: 'root',
})
export class PrintService {
  cmToPx(cm: number): number {
    return (cm * 96) / 2.54;
  }

  getHojaSize(config: PrintConfig): HojaSize {
    switch (config.hoja) {
      case 'A4':
        return { width: 21, height: 29.7 }; // cm
      case 'Letter':
        return { width: 21.6, height: 27.9 }; // cm
      case 'personalizado':
        return {
          width: config.anchoPersonalizado ?? 21,
          height: config.altoPersonalizado ?? 29.7,
        };
      default:
        return { width: 21, height: 29.7 };
    }
  }

  calcularDistribucionImpresion(
    config: PrintConfig,
    etiquetaUrl: string
  ): { etiquetas: EtiquetaDistribuida[]; width: number; height: number } {
    const hojaSize = this.getHojaSize(config);
    const hojaPxWidth = this.cmToPx(hojaSize.width);
    const hojaPxHeight = this.cmToPx(hojaSize.height);

    const etiquetaWidth = config.etiquetaSize.width;
    const etiquetaHeight = config.etiquetaSize.height;

    const margin = 0;

    const cols = Math.floor(hojaPxWidth / etiquetaWidth);
    const rows = Math.floor(hojaPxHeight / etiquetaHeight);

    const etiquetas: EtiquetaDistribuida[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        etiquetas.push({
          x: c * etiquetaWidth,
          y: r * etiquetaHeight,
          url: etiquetaUrl,
        });
      }
    }
    console.log('Distribución generada:', etiquetas.length);

    return {
      etiquetas,
      width: hojaPxWidth,
      height: hojaPxHeight,
    };
  }
}
