import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';
import { Producto } from '../../../../core/models/product';
import { ProductoService } from '../../../productos/services/producto.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PrintConfig } from '../../../../core/models/print-config';
import {
  HojaSize,
  EtiquetaSize,
  PrintService,
} from '../../../../core/services/print.service';
import { PrintDialogComponent } from '../../../../dialogs/print-dialog/print-dialog.component';
import { PrintSheetComponent } from '../print-sheet/print-sheet.component';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-header',
  imports: [
    MatOptionModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
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
  ultimasEtiquetas: any[] = [];

  etiquetasParaVistaPrevia: { x: number; y: number; url: string }[] = [];
  //configActualHoja!: HojaSize;
  configActual!: PrintConfig;

  mostrarVistaPrevia = false;

  @Output() modoVistaPrevia = new EventEmitter<boolean>();

  constructor(
    private canvasService: CanvasService,
    private productoService: ProductoService,
    private printService: PrintService,
    private dialog: MatDialog,
    private etiquetaService: EtiquetaService,
    private snackBar: MatSnackBar
  ) {
    this.cargarProductos();
    this.cargarUltimasEtiquetas();
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
    const canvas = this.canvasService.getCanvas();
    if (!canvas) {
      this.snackBar.open('No hay canvas disponible', 'Cerrar', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    // Solicitar nombre de la etiqueta
    const nombreEtiqueta = prompt('Ingrese el nombre para la etiqueta:');
    if (!nombreEtiqueta || nombreEtiqueta.trim() === '') {
      return;
    }

    const nombre = nombreEtiqueta.trim();
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects = canvas.toJSON().objects;

    // Verificar si el nombre ya existe
    this.etiquetaService.verificarNombreExistente(nombre).subscribe({
      next: (existe) => {
        if (existe) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
              title: 'Etiqueta existente',
              message: `Ya existe una etiqueta con el nombre "${nombre}". ¿Desea sobrescribirla?`
            }
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.guardarEtiquetaEnBD(nombre, width, height, objects);
            }
          });
        } else {
          this.guardarEtiquetaEnBD(nombre, width, height, objects);
        }
      },
      error: (error) => {
        console.error('Error verificando nombre:', error);
        // Intentar guardar de todos modos
        this.guardarEtiquetaEnBD(nombre, width, height, objects);
      }
    });
  }

  private guardarEtiquetaEnBD(nombre: string, width: number, height: number, objects: any): void {
    this.etiquetaService.guardarEtiqueta({
      nombre,
      width,
      height,
      objects
    }).subscribe({
      next: () => {
        this.snackBar.open(`Etiqueta "${nombre}" guardada exitosamente`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.cargarUltimasEtiquetas();
      },
      error: (error) => {
        console.error('Error guardando etiqueta:', error);
        this.snackBar.open('Error al guardar la etiqueta', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cargarUltimasEtiquetas(): void {
    this.etiquetaService.getUltimasEtiquetas(5).subscribe({
      next: (etiquetas) => {
        this.ultimasEtiquetas = etiquetas;
      },
      error: (error) => {
        console.error('Error cargando últimas etiquetas:', error);
      }
    });
  }

  cargarEtiquetaDesdeLista(etiqueta: any): void {
    this.etiquetaService.getEtiquetaCompleta(etiqueta.id).subscribe({
      next: async (etiquetaCompleta) => {
        const canvasData = {
          width: etiquetaCompleta.width,
          height: etiquetaCompleta.height,
          objects: etiquetaCompleta.objects
        };
        await this.canvasService.cargarDesdeJSON(JSON.stringify(canvasData));
        this.etiquetaSeleccionada = {
          width: etiquetaCompleta.width,
          height: etiquetaCompleta.height
        };
        this.snackBar.open(`Etiqueta "${etiquetaCompleta.nombre}" cargada`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error cargando etiqueta:', error);
        this.snackBar.open('Error al cargar la etiqueta', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  abrirTodasLasEtiquetas(): void {
    this.etiquetaService.getAllEtiquetas().subscribe({
      next: (etiquetas) => {
        // Aquí podrías abrir un diálogo con todas las etiquetas
        // Por ahora solo mostramos en consola
        console.log('Todas las etiquetas:', etiquetas);
        this.ultimasEtiquetas = etiquetas;
      },
      error: (error) => {
        console.error('Error cargando todas las etiquetas:', error);
        this.snackBar.open('Error al cargar las etiquetas', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
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
