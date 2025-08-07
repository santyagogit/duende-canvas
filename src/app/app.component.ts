import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { HeaderComponent } from './canvas/header/header.component';
import { CommonModule } from '@angular/common';
import { CanvasService } from './canvas/services/canvas.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

// mostrarCanvas = true;

// refrescarCanvas() {
//   this.canvasService.refrescarCanvas();
// }
