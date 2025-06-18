import { Component, Input, OnChanges } from '@angular/core';
import { HojaSize, EtiquetaSize, PrintService } from '../../services/print.service';
import { PrintConfig } from '../../models/print-config';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss'],
  standalone: true
})
export class PrintPreviewComponent implements OnChanges {
  @Input() config!: PrintConfig;
  @Input() etiqueta!: EtiquetaSize;

  distribucion: { x: number; y: number }[] = [];
  hoja!: HojaSize;
  etiquetaSizeMM = { width: 0, height: 0 };

  constructor(private printService: PrintService) { }

  ngOnChanges() {
    if (!this.config || !this.etiqueta) return;

    this.hoja = this.printService.getHojaSize(this.config);

    const resultado = this.printService.calcularDistribucionImpresion(this.hoja, this.etiqueta);
    this.distribucion = resultado.etiquetas;

    // Convertir etiqueta a mm
    const pxToMm = 0.2646;
    this.etiqueta = {
      width: this.etiqueta.width * pxToMm,
      height: this.etiqueta.height * pxToMm
    };
  }
}
