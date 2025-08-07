import { Component } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { HeaderComponent } from '../header/header.component';
import { CanvasComponent } from '../canvas.component';

@Component({
  selector: 'app-editor-etiquetas',
  imports: [HeaderComponent, CanvasComponent],
  templateUrl: './editor-etiquetas.component.html',
  styleUrl: './editor-etiquetas.component.scss',
})
export class EditorEtiquetasComponent {
  mostrarCanvas = true;

  constructor(private canvasService: CanvasService) {}

  refrescarCanvas() {
    this.canvasService.refrescarCanvas();
  }
}
