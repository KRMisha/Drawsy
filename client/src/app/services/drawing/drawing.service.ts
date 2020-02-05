import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    renderer: Renderer2;
    element: SVGElement;

    addElement(element: SVGElement): void {
        this.renderer.appendChild(this.element, element);
    }
}
