import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CanvasService } from '../services/canvas.service';
import { Producto } from '../../models/product';
import { ProductoService } from '../../services/producto.service';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PrintConfig } from '../../models/print-config';
import {
  HojaSize,
  EtiquetaSize,
  PrintService,
} from '../../services/print.service';
import { PrintDialogComponent } from '../../dialogs/print-dialog/print-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintSheetComponent } from '../../components/print-sheet/print-sheet.component';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-header',
  imports: [
    MatOptionModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    PrintSheetComponent,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  etiquetaSeleccionada: EtiquetaSize = { width: 400, height: 200 };
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;

  etiquetasParaVistaPrevia: { x: number; y: number; url: string }[] = [];
  //configActualHoja!: HojaSize;
  configActual!: PrintConfig;

  mostrarVistaPrevia = false;

  @Output() modoVistaPrevia = new EventEmitter<boolean>();

  constructor(
    private canvasService: CanvasService,
    private productoService: ProductoService,
    private printService: PrintService,
    private dialog: MatDialog
  ) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProducts().subscribe((productos) => {
      this.productos = productos;
      this.productoSeleccionado =
        this.productos.length > 0 ? this.productos[0] : null;
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
    this.canvasService.setCanvasSize(size.width, size.height);
  }

  async imprimirEtiquetas(config: PrintConfig) {
    // 1. Obtener URL de la imagen
    const etiquetaUrl = this.canvasService.getEtiquetaDataURL();
    console.log('URL de imagen:', etiquetaUrl?.substring(0, 50) + '...'); // Verifica que la URL sea válida

    // 2. Calcular distribución
    this.configActual = config;
    const distribucion = this.printService.calcularDistribucionImpresion(
      config,
      etiquetaUrl
    );

    console.log(
      'Cantidad de etiquetas generadas:',
      distribucion.etiquetas.length
    );
    console.table(distribucion.etiquetas);

    this.etiquetasParaVistaPrevia = distribucion.etiquetas;

    // 3. Forzar actualización de vista
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 4. Verificar en el DOM
    const areaImpresion = document.querySelector('#area-impresion');
    console.log('Área impresión:', areaImpresion);

    // 5. Imprimir
    setTimeout(() => {
      window.print();
    }, 100);
  }

  abrirVistaPrevia(config: PrintConfig) {
    this.modoVistaPrevia.emit(true);

    const etiquetaUrl = this.canvasService.getEtiquetaDataURL();
    const distribucion = this.printService.calcularDistribucionImpresion(
      config,
      etiquetaUrl
    );

    console.log('Distribución generada:', distribucion.etiquetas.length);

    this.configActual = config;
    this.etiquetasParaVistaPrevia = distribucion.etiquetas;
    this.mostrarVistaPrevia = true;
  }

  imprimir() {
    setTimeout(() => window.print(), 0);
  }

  abrirDialogoImpresion() {
    const dialogRef = this.dialog.open(PrintDialogComponent, {
      data: {
        hoja: 'A4',
        etiquetaSize: {
          width: 400,
          height: 200,
        },
        anchoPersonalizado: 600,
        altoPersonalizado: 800,
      } satisfies PrintConfig,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { action, config } = result;

      // Importante: agregás el tamaño de etiqueta ya seleccionado
      config.etiquetaSize = this.etiquetaSeleccionada;

      if (action === 'print') {
        this.abrirVistaPrevia(config);
      }
    });
  }

  cmToPx(cm: number): number {
    return this.printService.cmToPx(cm);
  }

  volverAlEditor(): void {
    this.mostrarVistaPrevia = false;
    this.modoVistaPrevia.emit(false);
  }
}
