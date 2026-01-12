import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductoService } from './services/producto.service';
import { Producto } from '../../core/models/product';
import { ProductoQueryParams } from '../../core/models/producto-query-params';
import { CanvasService } from '../editor-etiquetas/services/canvas.service';
import { PrintService, EtiquetaSize } from '../../core/services/print.service';
import { PrintConfig } from '../../core/models/print-config';
import { PrintDialogComponent } from '../../dialogs/print-dialog/print-dialog.component';
import { EtiquetaService } from '../../core/services/etiqueta.service';
import { Etiqueta, EtiquetaListItem } from '../../core/models/etiqueta';
import { PrintSheetComponent } from '../editor-etiquetas/components/print-sheet/print-sheet.component';

@Component({
  selector: 'app-productos',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    PrintSheetComponent,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  productos: Producto[] = [];
  dataSource!: MatTableDataSource<Producto>;
  displayedColumns: string[] = ['id', 'nombre', 'precio', 'descripcion', 'acciones'];
  loading = true;
  error = false;
  errorMessage = '';
  productosSeleccionados = new Set<string>(); // IDs de productos seleccionados
  etiquetasDisponibles: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;
  mostrarVistaPrevia = false;
  etiquetasParaVistaPrevia: { x: number; y: number; url: string }[] = [];
  configVistaPrevia: PrintConfig | null = null;

  // Query parameters
  queryParams: ProductoQueryParams = {
    fecha: new Date(), // Fecha actual por defecto
    turno: 'M',
    operacion: 'N',
  };

  // Options for selects
  turnoOptions = [
    { value: 'M', label: 'Mañana' },
    { value: 'T', label: 'Tarde' }
  ];

  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private canvasService: CanvasService,
    private printService: PrintService,
    private etiquetaService: EtiquetaService
  ) { }

  // Propiedad para la fecha mínima (fecha actual)
  fechaMinima = new Date();

  ngOnInit(): void {
    // Establecer fecha actual si no hay fecha
    if (!this.queryParams.fecha) {
      this.queryParams.fecha = new Date();
    }
    this.loadProducts();
    this.loadEtiquetasDisponibles();
  }

  loadEtiquetasDisponibles(): void {
    this.etiquetaService.getUltimasEtiquetas(5).subscribe({
      next: (etiquetas: EtiquetaListItem[]) => {
        // Convertir EtiquetaListItem[] a Etiqueta[] para compatibilidad
        this.etiquetasDisponibles = etiquetas.map(item => ({
          id: item.id,
          nombre: item.nombre,
          width: item.width,
          height: item.height,
          objects: null,
          fechaGuardado: item.fechaGuardado
        })) as Etiqueta[];
        if (this.etiquetasDisponibles.length > 0) {
          this.etiquetaSeleccionada = this.etiquetasDisponibles[0];
        }
      },
      error: (error) => {
        console.error('Error loading etiquetas:', error);
        // Si hay error, inicializar con array vacío
        this.etiquetasDisponibles = [];
      }
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.productoService.getProducts(this.queryParams).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.dataSource = new MatTableDataSource(productos);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
        this.snackBar.open(`${productos.length} productos cargados`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al cargar los productos';
        this.loading = false;

        // Show error snackbar
        this.snackBar.open(this.errorMessage, 'Reintentar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }).onAction().subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  // Fallback method to load mock data when API is not available
  loadMockProducts(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.productoService.getProductsMock().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.dataSource = new MatTableDataSource(productos);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
        this.snackBar.open(`Datos de prueba cargados (${productos.length} productos)`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar']
        });
      },
      error: (error) => {
        console.error('Error loading mock products:', error);
        this.error = true;
        this.errorMessage = 'Error al cargar los datos de prueba';
        this.loading = false;
      }
    });
  }

  toggleProductSelection(producto: Producto): void {
    if (this.productosSeleccionados.has(producto.id)) {
      this.productosSeleccionados.delete(producto.id);
    } else {
      this.productosSeleccionados.add(producto.id);
    }
    // Forzar actualización de la vista
    this.dataSource = new MatTableDataSource(this.productos);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  isProductSelected(productoId: string): boolean {
    return this.productosSeleccionados.has(productoId);
  }

  selectProduct(producto: Producto): void {
    this.productoService.setProductoSeleccionado(producto);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  refreshProducts(): void {
    this.loadProducts();
  }

  // Methods to handle parameter changes
  onFechaChange(fecha: Date | null): void {
    // Nunca permitir fecha vacía, usar fecha actual si es null
    this.queryParams.fecha = fecha || new Date();
  }

  onTurnoChange(turno: string): void {
    this.queryParams.turno = turno as 'M' | 'T' | 'N';
  }

  clearFilters(): void {
    this.queryParams = {
      fecha: new Date(), // Fecha actual por defecto
      turno: 'M',
      operacion: 'N',
    };
    this.loadProducts();
  }

  applyFilters(): void {
    this.loadProducts();
  }

  trackByProductId(index: number, producto: Producto): string {
    return producto.id;
  }

  onEtiquetaSeleccionadaChange(etiqueta: Etiqueta): void {
    this.etiquetaSeleccionada = etiqueta;
  }

  abrirDialogoImpresion(): void {
    if (this.productosSeleccionados.size === 0) {
      this.snackBar.open('Debe seleccionar al menos un producto para imprimir', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.etiquetaSeleccionada) {
      this.snackBar.open('Debe seleccionar una etiqueta para imprimir', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Cargar la etiqueta en el canvas primero
    this.etiquetaService.getEtiquetaCompleta(this.etiquetaSeleccionada.id!).subscribe({
      next: async (etiquetaCompleta) => {
        const canvasData = {
          width: etiquetaCompleta.width,
          height: etiquetaCompleta.height,
          objects: etiquetaCompleta.objects
        };
        await this.canvasService.cargarDesdeJSON(JSON.stringify(canvasData));

        const etiquetaSize: EtiquetaSize = {
          width: etiquetaCompleta.width,
          height: etiquetaCompleta.height
        };

        const dialogRef = this.dialog.open(PrintDialogComponent, {
          data: {
            hoja: 'A4',
            etiquetaSize: etiquetaSize,
            anchoPersonalizado: 600,
            altoPersonalizado: 800,
          } satisfies PrintConfig,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;

          const { action, config } = result;
          config.etiquetaSize = etiquetaSize;

          if (action === 'print') {
            this.imprimirEtiquetas(config);
          }
        });
      },
      error: (error) => {
        console.error('Error loading etiqueta completa:', error);
        this.snackBar.open('Error al cargar la etiqueta seleccionada', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  async imprimirEtiquetas(config: PrintConfig): Promise<void> {
    // Preparar lista de productos para imprimir
    const productosParaImprimir: Producto[] = [];

    this.productosSeleccionados.forEach(productoId => {
      const producto = this.productos.find(p => p.id === productoId);
      if (producto) {
        productosParaImprimir.push(producto);
      }
    });

    // Generar etiquetas individuales para cada producto
    const etiquetasUrls: string[] = [];
    this.snackBar.open('Generando etiquetas con datos de productos...', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    try {
      // Generar una etiqueta por cada producto
      for (const producto of productosParaImprimir) {
        // Generar la imagen de la etiqueta con los datos del producto
        // El método generarEtiquetaConProducto ya reemplaza los datos internamente
        const etiquetaUrl = await this.canvasService.generarEtiquetaConProducto(producto);
        etiquetasUrls.push(etiquetaUrl);
      }

      // Generar la distribución de impresión con todas las etiquetas
      const distribucion = this.printService.calcularDistribucionImpresionConProductos(
        config,
        etiquetasUrls
      );

      // Guardar la distribución para la vista previa
      this.etiquetasParaVistaPrevia = distribucion.etiquetas;
      this.configVistaPrevia = config;
      this.mostrarVistaPrevia = true;

      this.snackBar.open(`${etiquetasUrls.length} etiquetas generadas correctamente`, 'Cerrar', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } catch (error) {
      console.error('Error generando etiquetas:', error);
      this.snackBar.open('Error al generar las etiquetas', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  volverDeVistaPrevia(): void {
    this.mostrarVistaPrevia = false;
    this.etiquetasParaVistaPrevia = [];
    this.configVistaPrevia = null;
  }

  imprimirDesdeVistaPrevia(): void {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
