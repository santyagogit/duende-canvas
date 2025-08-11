import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from './features/editor-etiquetas/components/canvas/canvas.component';
import { HeaderComponent } from './features/editor-etiquetas/components/header/header.component';
import { CommonModule } from '@angular/common';
import { CanvasService } from './features/editor-etiquetas/services/canvas.service';
import { RouterModule } from '@angular/router';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

// mostrarCanvas = true;

// refrescarCanvas() {
//   this.canvasService.refrescarCanvas();
// }
