// productos.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  imports: [CommonModule],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  @Output() productoSeleccionado = new EventEmitter<Producto>();

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoService.getProducts().subscribe(data => {
      this.productos = data;
    });
  }

  seleccionarProducto(producto: Producto) {
    this.productoService.setProductoSeleccionado(producto);
  }
}

