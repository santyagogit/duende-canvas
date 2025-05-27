import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Canvas, FabricImage, FabricObject, Textbox } from 'fabric';
import { InsertImageDialogComponent } from '../../dialogs/insert-image-dialog/insert-image-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private canvas!: Canvas;

  constructor(private dialog: MatDialog) { }

  setCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }

  getCanvas(): Canvas {
    return this.canvas;
  }

  public aplicarEstilosPorDefecto(obj: FabricObject) {
    obj.set({
      cornerStyle: 'circle',
      cornerColor: '#3f51b5',
      borderColor: '#3f51b5',
      transparentCorners: false,
      rotatingPointOffset: 20,
      lockScalingFlip: true,
    });

    this.redondearControlRotacion(obj);
  }


  // Método para redondear el control de rotación
  public redondearControlRotacion(obj: FabricObject) {
    if (!obj.controls || !obj.controls['mtr']) return;

    obj.controls['mtr'].offsetY = -20;

    obj.controls['mtr'].render = function (ctx, left, top, styleOverride, fabricObject) {
      const size = (styleOverride?.cornerSize ?? (this as any)['cornerSize']) || 12;

      ctx.save();
      ctx.beginPath();
      ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.restore();
    }
    this.canvas.renderAll(); // Redibuja el canvas
  }

  // Metodo para insertar texto
  insertText(textContent: string) {
    const text = new Textbox(textContent, {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: 'black'
    });

    this.aplicarEstilosPorDefecto(text);
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    // text.setCoords();
    this.canvas.renderAll();

  }

  async insertarTexto(texto: string, fontFamily: string = 'Arial') {
    await (document as any).fonts.load(`18px "${fontFamily}"`);

    const text = new Textbox(texto, {
      left: 50,
      top: 50,
      fontSize: 18,
      fontFamily: fontFamily,
      editable: true,
      fill: '#000'
    });

    this.canvas.add(text);
    this.redondearControlRotacion(text);
    this.canvas.setActiveObject(text);
  }


  makeObjectEditable(object: FabricObject) {
    if (!object) return;

    if (object instanceof Textbox) {
      object.enterEditing();
      object.selectAll?.(); // si existe
      object.hiddenTextarea?.focus();
    } else {
      console.log(`Tipo de objeto no editable directamente: ${object.type}`);
    }
  }


  // // Método para insertar una imagen
  // async insertImage(url: string) {
  //   const img = await FabricImage.fromURL(url);
  //   img.set({
  //     left: 100,
  //     top: 100,
  //     scaleX: 0.5,
  //     scaleY: 0.5
  //   });


  // }

  openImageDialog() {
    console.log('Opening image dialog');
    const dialogRef = this.dialog.open(InsertImageDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const img = await FabricImage.fromURL(result);
        img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });

        this.aplicarEstilosPorDefecto(img);
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        // this.canvas.add(img);
        // this.canvas.renderAll();
      }
    });
  }

  registerDoubleClickToEdit() {
    if (!this.canvas) return;

    console.log('Registering double click event');
    this.canvas.on('mouse:dblclick', (e) => {
      const target = e.target;
      if (target && target.type === 'textbox') {
        (target as Textbox).enterEditing();
        (target as Textbox).hiddenTextarea?.focus();
      }
    });
  }

  // Método para eliminar el objeto seleccionado
  deleteSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.canvas.renderAll();
    }
  }

  public constrainObjectToCanvas(target: FabricObject) {
    const padding = 0;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    target.setCoords();
    const coords = target.oCoords; // Usa las coordenadas originales (rotadas)

    const xs = Object.values(coords).map((point) => point.x);
    const ys = Object.values(coords).map((point) => point.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    let dx = 0;
    let dy = 0;

    if (minX < padding) dx = padding - minX;
    else if (maxX > canvasWidth - padding) dx = canvasWidth - maxX;

    if (minY < padding) dy = padding - minY;
    else if (maxY > canvasHeight - padding) dy = canvasHeight - maxY;

    target.left! += dx;
    target.top! += dy;

    target.setCoords();
  }

}
