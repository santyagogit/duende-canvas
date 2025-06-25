import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrintConfig } from '../../models/print-config';

@Component({
  selector: 'app-print-sheet',
  templateUrl: './print-sheet.component.html',
  styleUrls: ['./print-sheet.component.scss'],
  imports: [NgStyle]
})
export class PrintSheetComponent {
  @Input() config!: PrintConfig;
  @Input() etiquetas: { x: number; y: number; url: string }[] = [];

  get width(): number {
    if (this.config.hoja === 'A4') return this.mmToPx(210);
    if (this.config.hoja === 'Letter') return this.mmToPx(216);
    return this.mmToPx(this.config.anchoPersonalizado || 210);
  }

  get height(): number {
    if (this.config.hoja === 'A4') return this.mmToPx(297);
    if (this.config.hoja === 'Letter') return this.mmToPx(279);
    return this.mmToPx(this.config.altoPersonalizado || 297);
  }

  mmToPx(mm: number): number {
    return (mm * 96) / 25.4;
  }
}
