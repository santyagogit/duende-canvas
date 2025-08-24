import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductoService } from './services/producto.service';
import { Producto } from '../../core/models/product';

@Component({
  selector: 'app-productos',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
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

  constructor(private productoService: ProductoService) { }

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

    this.productoService.getProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.dataSource = new MatTableDataSource(productos);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = true;
        this.loading = false;
      }
    });
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
}
