import { Component } from '@angular/core';
import { CanvasService } from '../canvas/services/canvas.service';
import { Producto } from '../models/product';
import { ProductoService } from '../services/producto.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PrintConfig } from '../models/print-config';
import { HojaSize, EtiquetaSize, PrintService } from '../services/print.service';
import { PrintDialogComponent } from '../dialogs/print-dialog/print-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  imports: [MatFormField, MatLabel, MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  etiquetaSeleccionada: EtiquetaSize = { width: 400, height: 200 };
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;

  etiquetasParaVistaPrevia: { x: number; y: number }[] = [];
  //configActualHoja!: HojaSize;
  configActual!: PrintConfig;

  constructor(
    private canvasService: CanvasService,
    private productoService: ProductoService,
    private printService: PrintService,
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

  cambiarTamanioEtiqueta(size: EtiquetaSize) {
    this.etiquetaSeleccionada = size;
    console.log('Tamaño de etiqueta cambiado a:', size);
  }

  // mostrarVistaPrevia(config: PrintConfig) {
  //   this.configActual = { ...config };
  //   this.etiquetaSeleccionada = config.etiquetaSize;

  //   const hoja = this.printService.getHojaSize(config);
  //   const distribucion = this.printService.calcularDistribucionImpresion(
  //     hoja,
  //     this.etiquetaSeleccionada
  //   );

  //   this.etiquetasParaVistaPrevia = distribucion.etiquetas;
  //   this.configActualHoja = hoja;
  // }

  getHojaSize(config: PrintConfig): HojaSize {
    switch (config.hoja) {
      case 'A4':
        return { width: 210, height: 297 };
      case 'Letter':
        return { width: 216, height: 279 };
      case 'personalizado':
        return {
          width: config.anchoPersonalizado ?? 210,
          height: config.altoPersonalizado ?? 297
        };
      default:
        return { width: 210, height: 297 };
    }
  }

  imprimirEtiquetas(config: PrintConfig) {
    const url = this.canvasService.getEtiquetaDataURL();
    const resultado = this.printService.calcularDistribucionImpresion(config, url);
    this.etiquetasParaVistaPrevia = resultado.etiquetas;

    setTimeout(() => window.print(), 0);
  }

  abrirDialogoImpresion() {
    const dialogRef = this.dialog.open(PrintDialogComponent, {
      data: {
        hoja: 'A4',
        etiquetaSize: { width: 200, height: 100 },
        anchoPersonalizado: 600,
        altoPersonalizado: 800
      } satisfies PrintConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const { action, config } = result;

      // Generar imagen de la etiqueta actual desde el canvas
      const etiquetaUrl = this.canvasService.getEtiquetaDataURL();

      // Calcular la grilla de etiquetas
      const distribucion = this.printService.calcularDistribucionImpresion(config, etiquetaUrl);

      this.configActual = config;
      this.etiquetasParaVistaPrevia = distribucion.etiquetas;

      if (action === 'print') {
        setTimeout(() => window.print(), 0); // permite que se renderice primero
      }
    });
  }
}
