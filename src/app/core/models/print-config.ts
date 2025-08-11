export interface PrintConfig {
    hoja: 'A4' | 'Letter' | 'personalizado';
    etiquetaSize: {
        width: number; // px
        height: number; // px
    };
    anchoPersonalizado?: number; // cm
    altoPersonalizado?: number;  // cm
}
