import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrido un error';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error del cliente: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
                        break;
                    case 400:
                        errorMessage = 'Solicitud incorrecta';
                        break;
                    case 401:
                        errorMessage = 'No autorizado';
                        break;
                    case 403:
                        errorMessage = 'Acceso prohibido';
                        break;
                    case 404:
                        errorMessage = 'Recurso no encontrado';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor';
                        break;
                    default:
                        errorMessage = `Error del servidor: ${error.status}`;
                }
            }

            // Show error notification
            snackBar.open(errorMessage, 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });

            return throwError(() => error);
        })
    );
};