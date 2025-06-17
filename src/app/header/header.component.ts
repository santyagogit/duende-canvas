import { Component, NgModule } from '@angular/core';
import { CanvasService } from '../canvas/services/canvas.service';
import { Producto } from '../models/product';
import { ProductoService } from '../services/producto.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PrintConfig } from '../models/print-config';
import { PrintDialogComponent } from '../dialogs/print-dialog/print-dialog.component';

@Component({
  selector: 'app-header',
  imports: [MatFormField, MatLabel, MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  canvasWidth = 400; // valor inicial, puede venir de una constante
  canvasHeight = 250;

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;

  constructor(
    private canvasService: CanvasService,
    private productoService: ProductoService,
    private dialog: MatDialog
  ) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProducts().subscribe(productos => {
      this.productos = productos;
      this.productoSeleccionado = this.productos.length > 0 ? this.productos[0] : null;
      if (this.productoSeleccionado) {
        this.seleccionarProducto(this.productoSeleccionado);
      }
    });
  }
  seleccionarProducto(producto: Producto) {
    this.productoService.setProductoSeleccionado(producto);
  }

  // Acá irán botones para agregar texto, imagen, cambiar color, etc.
  insertarTexto() {
    this.canvasService.insertarTexto('Nuevo texto');
  }

  async insertarImagen() {
    this.canvasService.openImageDialog();
  }

  eliminarSeleccion() {
    const canvas = this.canvasService.getCanvas();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }

  limpiarCanvas() {
    this.canvasService.limpiarCanvas();
  }

  agregarCampo(campo: 'ID' | 'NOMBRE' | 'PUNIT') {
    console.log(`Agregando campo: ${campo}`);
    if (!this.productoSeleccionado) return;
    console.log('Producto seleccionado:', this.productoSeleccionado);
    let texto = '';
    let fuente = 'Arial';

    switch (campo) {
      case 'ID':
        texto = this.productoSeleccionado.id;
        fuente = 'Code 128';
        break;
      case 'NOMBRE':
        texto = this.productoSeleccionado.nombre;
        break;
      case 'PUNIT':
        texto = `$${this.productoSeleccionado.precio.toFixed(2)}`;
        break;
    }

    console.log(`Insertando texto: "${texto}" con fuente: ${fuente}`);
    this.canvasService.insertarTexto(texto, fuente);
  }

  guardarEtiqueta() {
    this.canvasService.guardarComoJSON();
  }


  cargarEtiqueta() {
    this.canvasService.abrirFileInput();
  }

  cambiarTamanioEtiqueta(dim: { width: number, height: number }) {
    this.canvasService.setCanvasSize(dim.width, dim.height);
  }

  abrirDialogoImpresion() {
    const defaultConfig: PrintConfig = {
      hoja: 'A4',
    };

    this.dialog.open(PrintDialogComponent, {
      width: '500px',
      data: defaultConfig
    }).afterClosed().subscribe(result => {
      if (result) {
        const { action, config } = result;
        if (action === 'preview') {
          this.mostrarVistaPrevia(config);
        } else if (action === 'print') {
          this.imprimirEtiquetas(config);
        }
      }
    });
  }

  mostrarVistaPrevia(config: PrintConfig) {
    console.log('Mostrar vista previa con config:', config);
    // Aquí va la lógica que genera y muestra la vista previa
  }

  imprimirEtiquetas(config: PrintConfig) {
    console.log('Imprimir con config:', config);
    // Aquí va la lógica que genera el PDF o llama a window.print()
  }

}
