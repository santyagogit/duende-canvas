import { Component } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { HeaderComponent } from './header/header.component';
import { PrintSheetComponent } from './components/print-sheet/print-sheet.component';

@Component({
  selector: 'app-root',
  imports: [CanvasComponent, HeaderComponent, PrintSheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'duende-canvas';
}
