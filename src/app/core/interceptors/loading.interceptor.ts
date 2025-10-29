import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    // You can add loading indicator logic here
    // For example, show a global loading spinner
    console.log('Loading started for:', req.url);

    return next(req).pipe(
        finalize(() => {
            console.log('Loading finished for:', req.url);
        })
    );
};