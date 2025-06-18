export interface PrintConfig {
    hoja: 'A4' | 'Letter' | 'personalizado';
    anchoPersonalizado?: number;
    altoPersonalizado?: number;
    etiquetaSize: {
        width: number; // px
        height: number; // px
    };
}
