import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CanvasService } from '../../../features/editor-etiquetas/services/canvas.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-top-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent implements OnInit, OnDestroy {
  mostrarBotonesEtiquetas = false;
  private routerSubscription?: Subscription;

  constructor(
    private canvasService: CanvasService,
    private router: Router
  ) { }

  ngOnInit() {
    // Verificar la ruta actual
    this.actualizarVisibilidadBotones(this.router.url);

    // Suscribirse a los cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.actualizarVisibilidadBotones(event.url);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private actualizarVisibilidadBotones(url: string) {
    this.mostrarBotonesEtiquetas = url === '/editor' || url.startsWith('/editor/');
  }

  guardarEtiqueta() {
    this.canvasService.guardarComoJSON();
  }

  cargarEtiqueta() {
    this.canvasService.abrirFileInput();
  }
}
