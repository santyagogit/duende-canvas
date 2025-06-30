import { Component, Input } from '@angular/core';
import { PrintConfig } from '../../models/print-config';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-print-sheet',
  templateUrl: './print-sheet.component.html',
  styleUrls: ['./print-sheet.component.scss'],
})
export class PrintSheetComponent {
  @Input() config!: PrintConfig;
  @Input() etiquetas: { x: number; y: number; url: string }[] = [];

  constructor(private printService: PrintService) { }

  get width(): number {
    if (this.config.hoja === 'A4') return this.cmToPx(21);
    if (this.config.hoja === 'Letter') return this.cmToPx(21.6);
    return this.cmToPx(this.config.anchoPersonalizado || 21);
  }

  get height(): number {
    if (this.config.hoja === 'A4') return this.cmToPx(29.7);
    if (this.config.hoja === 'Letter') return this.cmToPx(27.9);
    return this.cmToPx(this.config.altoPersonalizado || 29.7);
  }

  cmToPx(cm: number): number {
    return this.printService.cmToPx(cm);
  }
}
