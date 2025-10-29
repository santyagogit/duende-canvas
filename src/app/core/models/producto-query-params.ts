export interface ProductoQueryParams {
    fecha?: Date;
    turno?: 'M' | 'T' | 'N'; // Mañana, Tarde, Noche
    operacion?: 'N' | 'R'; // Normal, Recibidas
    entrada?: boolean;
}
