import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Producto } from '../../../core/models/product';
import { ProductoQueryParams } from '../../../core/models/producto-query-params';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productoSeleccionado = new BehaviorSubject<Producto | null>(null);
  private apiUrl = environment.productosApiUrl;

  constructor(private http: HttpClient) { }

  setProductoSeleccionado(producto: Producto) {
    console.log('Producto seleccionado:', producto);
    this.productoSeleccionado.next(producto);
  }

  getProductoSeleccionado(): Observable<Producto | null> {
    return this.productoSeleccionado.asObservable();
  }

  getProducts(params?: ProductoQueryParams): Observable<Producto[]> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.fecha) {
        httpParams = httpParams.set('fecha', params.fecha.toISOString());
      }
      if (params.turno) {
        httpParams = httpParams.set('turno', params.turno);
      }
      if (params.operacion) {
        httpParams = httpParams.set('operacion', params.operacion);
      }
      if (params.entrada !== undefined) {
        httpParams = httpParams.set('entrada', params.entrada.toString());
      }
    }

    return this.http.get<Producto[]>(this.apiUrl, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  // Fallback method with mock data for development/testing
  getProductsMock(): Observable<Producto[]> {
    const productosMock: Producto[] = [
      {
        id: '123456789',
        nombre: 'Producto A',
        precio: 10.99,
        descripcion: 'Descripción del producto A',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+A'
      },
      {
        id: '987654321',
        nombre: 'Producto B',
        precio: 24.5,
        descripcion: 'Descripción del producto B',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+B'
      },
      {
        id: '456789123',
        nombre: 'Producto C',
        precio: 15.0,
        descripcion: 'Descripción del producto C',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+C'
      },
      {
        id: '789123456',
        nombre: 'Producto D',
        precio: 32.99,
        descripcion: 'Descripción del producto D',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+D'
      },
      {
        id: '321654987',
        nombre: 'Producto E',
        precio: 18.50,
        descripcion: 'Descripción del producto E',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+E'
      },
      {
        id: '654987321',
        nombre: 'Producto F',
        precio: 45.75,
        descripcion: 'Descripción del producto F',
        imagen: 'https://via.placeholder.com/150x150?text=Producto+F'
      },
      {
        id: '147258369',
        nombre: 'Laptop Gaming',
        precio: 1299.99,
        descripcion: 'Laptop de alto rendimiento para gaming',
        imagen: 'https://via.placeholder.com/150x150?text=Laptop+Gaming'
      },
      {
        id: '258369147',
        nombre: 'Smartphone Pro',
        precio: 899.50,
        descripcion: 'Smartphone de última generación',
        imagen: 'https://via.placeholder.com/150x150?text=Smartphone+Pro'
      },
      {
        id: '369147258',
        nombre: 'Auriculares Wireless',
        precio: 89.99,
        descripcion: 'Auriculares bluetooth con cancelación de ruido',
        imagen: 'https://via.placeholder.com/150x150?text=Auriculares+Wireless'
      },
      {
        id: '741852963',
        nombre: 'Tablet Ultra',
        precio: 549.99,
        descripcion: 'Tablet de 10 pulgadas con pantalla retina',
        imagen: 'https://via.placeholder.com/150x150?text=Tablet+Ultra'
      },
      {
        id: '852963741',
        nombre: 'Monitor 4K',
        precio: 399.99,
        descripcion: 'Monitor de 27 pulgadas con resolución 4K',
        imagen: 'https://via.placeholder.com/150x150?text=Monitor+4K'
      },
      {
        id: '963741852',
        nombre: 'Teclado Mecánico',
        precio: 129.99,
        descripcion: 'Teclado mecánico con switches Cherry MX',
        imagen: 'https://via.placeholder.com/150x150?text=Teclado+Mecanico'
      },
      {
        id: '159357486',
        nombre: 'Mouse Gaming',
        precio: 79.99,
        descripcion: 'Mouse gaming con sensor óptico de alta precisión',
        imagen: 'https://via.placeholder.com/150x150?text=Mouse+Gaming'
      },
      {
        id: '357486159',
        nombre: 'Webcam HD',
        precio: 59.99,
        descripcion: 'Webcam de 1080p con micrófono integrado',
        imagen: 'https://via.placeholder.com/150x150?text=Webcam+HD'
      },
      {
        id: '486159357',
        nombre: 'Impresora Láser',
        precio: 199.99,
        descripcion: 'Impresora láser monocromática de alta velocidad',
        imagen: 'https://via.placeholder.com/150x150?text=Impresora+Laser'
      },
      {
        id: '951753852',
        nombre: 'Disco SSD',
        precio: 89.99,
        descripcion: 'Disco sólido de 500GB con velocidad de lectura rápida',
        imagen: 'https://via.placeholder.com/150x150?text=Disco+SSD'
      },
      {
        id: '753852951',
        nombre: 'Memoria RAM',
        precio: 69.99,
        descripcion: 'Memoria RAM DDR4 de 16GB para gaming',
        imagen: 'https://via.placeholder.com/150x150?text=Memoria+RAM'
      },
      {
        id: '852951753',
        nombre: 'Tarjeta Gráfica',
        precio: 449.99,
        descripcion: 'Tarjeta gráfica RTX 3060 con 12GB de VRAM',
        imagen: 'https://via.placeholder.com/150x150?text=Tarjeta+Grafica'
      },
      {
        id: '951753852',
        nombre: 'Procesador Intel',
        precio: 299.99,
        descripcion: 'Procesador Intel Core i7 de 11ª generación',
        imagen: 'https://via.placeholder.com/150x150?text=Procesador+Intel'
      },
      {
        id: '753852951',
        nombre: 'Placa Base',
        precio: 179.99,
        descripcion: 'Placa base ATX con socket LGA1200',
        imagen: 'https://via.placeholder.com/150x150?text=Placa+Base'
      },
      {
        id: '852951753',
        nombre: 'Fuente de Poder',
        precio: 89.99,
        descripcion: 'Fuente de poder modular de 650W 80 Plus Gold',
        imagen: 'https://via.placeholder.com/150x150?text=Fuente+de+Poder'
      },
      {
        id: '951753852',
        nombre: 'Gabinete Gaming',
        precio: 129.99,
        descripcion: 'Gabinete ATX con ventiladores RGB incluidos',
        imagen: 'https://via.placeholder.com/150x150?text=Gabinete+Gaming'
      },
      {
        id: '753852951',
        nombre: 'Ventilador CPU',
        precio: 49.99,
        descripcion: 'Ventilador para CPU con disipador de cobre',
        imagen: 'https://via.placeholder.com/150x150?text=Ventilador+CPU'
      },
      {
        id: '852951753',
        nombre: 'Cable HDMI',
        precio: 19.99,
        descripcion: 'Cable HDMI de alta velocidad 2.1',
        imagen: 'https://via.placeholder.com/150x150?text=Cable+HDMI'
      },
      {
        id: '951753852',
        nombre: 'Hub USB',
        precio: 29.99,
        descripcion: 'Hub USB 3.0 con 7 puertos y alimentación',
        imagen: 'https://via.placeholder.com/150x150?text=Hub+USB'
      },
      {
        id: '753852951',
        nombre: 'Alfombrilla Gaming',
        precio: 24.99,
        descripcion: 'Alfombrilla gaming extra grande con bordes iluminados',
        imagen: 'https://via.placeholder.com/150x150?text=Alfombrilla+Gaming'
      },
      {
        id: '852951753',
        nombre: 'Soporte Monitor',
        precio: 39.99,
        descripcion: 'Soporte para monitor con brazo articulado',
        imagen: 'https://via.placeholder.com/150x150?text=Soporte+Monitor'
      },
      {
        id: '951753852',
        nombre: 'Micrófono USB',
        precio: 79.99,
        descripcion: 'Micrófono USB con condensador para streaming',
        imagen: 'https://via.placeholder.com/150x150?text=Microfono+USB'
      },
      {
        id: '753852951',
        nombre: 'Lámpara LED',
        precio: 34.99,
        descripcion: 'Lámpara LED de escritorio con luz ajustable',
        imagen: 'https://via.placeholder.com/150x150?text=Lampara+LED'
      },
      {
        id: '852951753',
        nombre: 'Organizador Cables',
        precio: 14.99,
        descripcion: 'Organizador de cables con clips y fundas',
        imagen: 'https://via.placeholder.com/150x150?text=Organizador+Cables'
      }
    ];
    return of(productosMock);
  }

  // Method to get a single product by ID
  getProductById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to create a new product
  createProduct(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Method to update a product
  updateProduct(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Method to delete a product
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method to search products
  searchProducts(query: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          errorMessage = 'No se encontraron productos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en ProductoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
