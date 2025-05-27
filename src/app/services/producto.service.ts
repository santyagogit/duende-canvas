import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Producto } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productoSeleccionado = new BehaviorSubject<Producto | null>(null);

  setProductoSeleccionado(producto: Producto) {
    console.log('Producto seleccionado:', producto);
    this.productoSeleccionado.next(producto);
  }

  getProductoSeleccionado(): Observable<Producto | null> {
    return this.productoSeleccionado.asObservable();
  }

  getProducts(): Observable<Producto[]> {
    const productosMock: Producto[] = [
      { id: '123456789', nombre: 'Producto A', precio: 10.99 },
      { id: '987654321', nombre: 'Producto B', precio: 24.50 },
      { id: '456789123', nombre: 'Producto C', precio: 15.00 }
    ];
    return of(productosMock);
  }
}
