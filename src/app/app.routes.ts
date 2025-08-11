import { Routes } from '@angular/router';
import { EditorEtiquetasComponent } from './features/editor-etiquetas//editor-etiquetas.component';
import { ProductosComponent } from './features/productos/productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'editor', pathMatch: 'full' },
  { path: 'editor', component: EditorEtiquetasComponent },
  { path: 'productos', component: ProductosComponent },
];
