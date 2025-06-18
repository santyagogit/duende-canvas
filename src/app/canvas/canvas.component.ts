import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Canvas, FabricObject } from 'fabric';
import { CanvasService } from './services/canvas.service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('etiquetaCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvas!: Canvas;

  canvasWidth = 600;
  canvasHeight = 350;

  constructor(private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.canvas = new Canvas(this.canvasRef.nativeElement, {
      width: this.canvasWidth,
      height: this.canvasHeight,
      selection: false,
      preserveObjectStacking: true,
    });

    this.canvasService.setCanvas(this.canvas);

    // Movimiento
    this.canvas.on('object:moving', (e) => {
      if (e.target) this.canvasService.constrainObjectToCanvas(e.target);
    });

    // Escalado
    this.canvas.on('object:scaling', (e) => {
      if (!e.target) return;
      this.canvasService.constrainObjectToCanvas(e.target);
    });

    // Rotación
    this.canvas.on('object:rotating', (e) => {
      if (!e.target) return;
      this.canvasService.constrainObjectToCanvas(e.target);
    });

    this.canvas.on('mouse:dblclick', (e) => {
      const target = e.target;
      if (target) {
        console.log('Double click on', target.type);
        this.canvasService.makeObjectEditable(target as FabricObject);
      }
    });

  }
}