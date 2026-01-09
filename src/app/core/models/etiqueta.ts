export interface Etiqueta {
    id?: number;
    nombre: string;
    width: number;
    height: number;
    objects: any; // JSON de objetos del canvas
    fechaGuardado: Date;
}

export interface EtiquetaListItem {
    id: number;
    nombre: string;
    width: number;
    height: number;
    fechaGuardado: Date;
}

