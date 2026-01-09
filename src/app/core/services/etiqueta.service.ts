import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, throwError } from 'rxjs';
import { Etiqueta, EtiquetaListItem } from '../models/etiqueta';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EtiquetaService {
    private apiUrl = `${environment.apiUrl}/etiquetas`;

    constructor(private http: HttpClient) { }

    guardarEtiqueta(etiqueta: Omit<Etiqueta, 'id' | 'fechaGuardado'>): Observable<Etiqueta> {
        const etiquetaParaGuardar = {
            ...etiqueta,
            fechaGuardado: new Date()
        };
        return this.http.post<Etiqueta>(this.apiUrl, etiquetaParaGuardar).pipe(
            catchError(this.handleError)
        );
    }

    actualizarEtiqueta(id: number, etiqueta: Partial<Etiqueta>): Observable<Etiqueta> {
        return this.http.put<Etiqueta>(`${this.apiUrl}/${id}`, etiqueta).pipe(
            catchError(this.handleError)
        );
    }

    getEtiquetaCompleta(id: number): Observable<Etiqueta> {
        return this.http.get<Etiqueta>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    getUltimasEtiquetas(cantidad: number = 5): Observable<EtiquetaListItem[]> {
        const params = new HttpParams().set('limit', cantidad.toString());
        return this.http.get<EtiquetaListItem[]>(`${this.apiUrl}/ultimas`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    getAllEtiquetas(): Observable<EtiquetaListItem[]> {
        return this.http.get<EtiquetaListItem[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    verificarNombreExistente(nombre: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/verificar-nombre/${encodeURIComponent(nombre)}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        let errorMessage = 'Ha ocurrido un error desconocido';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 404:
                    errorMessage = 'No se encontró la etiqueta';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor';
                    break;
                case 0:
                    errorMessage = 'No se pudo conectar con el servidor';
                    break;
                default:
                    errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
            }
        }

        console.error('Error en EtiquetaService:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}

