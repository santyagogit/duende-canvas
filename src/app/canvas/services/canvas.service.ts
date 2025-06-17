import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Canvas, FabricImage, FabricObject, Textbox } from 'fabric';
import { InsertImageDialogComponent } from '../../dialogs/insert-image-dialog/insert-image-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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
  async insertarTexto(texto: string, fontFamily: string = 'Arial', opcionesExtra: Partial<Textbox> = {}) {
    await (document as any).fonts.load(`18px "${fontFamily}"`);

    const text = new Textbox(texto, {
      left: 50,
      top: 50,
      fontSize: 18,
      fontFamily: fontFamily,
      editable: true,
      fill: '#000',
      ...opcionesExtra // Permite pasar estilos adicionales
    });

    this.aplicarEstilosPorDefecto?.(text);
    this.redondearControlRotacion?.(text);

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
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

  exportarJSON(): string {
    return JSON.stringify(this.canvas.toJSON());
  }

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

  guardarComoJSON() {

    const data = {
      width: this.canvas.getWidth(),
      height: this.canvas.getHeight(),
      objects: this.canvas.toJSON().objects,
    };

    const json = JSON.stringify(data); // Incluye propiedades personalizadas

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'etiqueta.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  async cargarDesdeJSON(json: string) {
    const parsed = JSON.parse(json);

    // Establecer tamaño del canvas ANTES de cargar los objetos
    if (parsed.width && parsed.height) {
      this.canvas.setDimensions({ width: parsed.width, height: parsed.height });
    }

    await new Promise<void>((resolve) => {
      this.canvas.loadFromJSON(parsed, () => {
        resolve();
      });
    });

    await (document as any).fonts.ready;

    this.canvas.getObjects().forEach(obj => obj.setCoords());
    this.canvas.renderAll();

    this.canvas.getObjects().forEach(obj => {
      this.aplicarEstilosPorDefecto(obj);
      this.redondearControlRotacion(obj);
    });
  }

  limpiarCanvas(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: '¿Seguro que querés borrar todo el contenido del canvas?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.canvas.getObjects().forEach(obj => this.canvas.remove(obj));
        this.canvas.renderAll();
      }
    });
  }

  async cargarEtiqueta(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const json = reader.result as string;
      await this.cargarDesdeJSON(json);
    };

    reader.readAsText(file);
  }

  abrirFileInput() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const json = reader.result as string;
        await this.cargarDesdeJSON(json);
      };

      reader.readAsText(file);
    };

    fileInput.click();
  }

  setCanvasSize(width: number, height: number) {
    this.canvas.setDimensions({ width, height });
    this.canvas.renderAll();
  }



}
