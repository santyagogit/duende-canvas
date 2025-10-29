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
    MatCheckboxModule
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
  searchQuery = '';

  // Query parameters
  queryParams: ProductoQueryParams = {
    fecha: undefined,
    turno: 'M',
    operacion: 'N',
    entrada: false
  };

  // Options for selects
  turnoOptions = [
    { value: 'M', label: 'Mañana' },
    { value: 'T', label: 'Tarde' },
    { value: 'N', label: 'Noche' }
  ];

  operacionOptions = [
    { value: 'N', label: 'Normal' },
    { value: 'R', label: 'Recibidas' }
  ];

  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
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

  selectProduct(producto: Producto): void {
    this.productoService.setProductoSeleccionado(producto);
    this.snackBar.open(`Producto "${producto.nombre}" seleccionado`, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Search products using API
  searchProducts(): void {
    if (!this.searchQuery.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.productoService.searchProducts(this.searchQuery).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.dataSource = new MatTableDataSource(productos);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
        this.snackBar.open(`${productos.length} productos encontrados para "${this.searchQuery}"`, 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al buscar productos';
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadProducts();
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  // Methods to handle parameter changes
  onFechaChange(fecha: Date | null): void {
    this.queryParams.fecha = fecha || undefined;
  }

  onTurnoChange(turno: string): void {
    this.queryParams.turno = turno as 'M' | 'T' | 'N';
  }

  onOperacionChange(operacion: string): void {
    this.queryParams.operacion = operacion as 'N' | 'R';
  }

  onEntradaChange(entrada: boolean): void {
    this.queryParams.entrada = entrada;
  }

  clearFilters(): void {
    this.queryParams = {
      fecha: undefined,
      turno: 'M',
      operacion: 'N',
      entrada: false
    };
    this.loadProducts();
  }

  applyFilters(): void {
    this.loadProducts();
  }
}
