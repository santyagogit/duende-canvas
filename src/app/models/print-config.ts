export interface PrintConfig {
    hoja: 'A4' | 'Letter' | 'personalizado';
    anchoPersonalizado?: number; // en mm
    altoPersonalizado?: number;  // en mm
}
