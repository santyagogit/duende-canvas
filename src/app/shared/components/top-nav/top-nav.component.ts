import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CanvasService } from '../../../features/editor-etiquetas/services/canvas.service';

@Component({
  selector: 'app-top-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  constructor(private canvasService: CanvasService) { }

  guardarEtiqueta() {
    this.canvasService.guardarComoJSON();
  }

  cargarEtiqueta() {
    this.canvasService.abrirFileInput();
  }
}
