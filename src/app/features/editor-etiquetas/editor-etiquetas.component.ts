import { Component } from '@angular/core';
import { CanvasService } from '../editor-etiquetas/services/canvas.service';
import { HeaderComponent } from '../editor-etiquetas/components/header/header.component';
import { CanvasComponent } from '../editor-etiquetas/components/canvas/canvas.component';

@Component({
  selector: 'app-editor-etiquetas',
  imports: [CanvasComponent, HeaderComponent],
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
