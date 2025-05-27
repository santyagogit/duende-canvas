import { Component } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [CanvasComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'duende-canvas';
}
