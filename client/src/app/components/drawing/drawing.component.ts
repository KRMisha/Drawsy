import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { PencilService } from '../../services/pencil/pencil.service'

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent {
    private isMouseDown = false;
    private pathString: string;
    private svg: SVGElement = this.renderer.createElement('svg', 'svg');
    private path: SVGPathElement;

    constructor(private renderer: Renderer2, private element: ElementRef,
                private pencilService: PencilService) {
        this.renderer.setAttribute(this.svg, 'version', '1.1');
        this.renderer.setAttribute(this.svg, 'baseProfile', 'full');
        this.renderer.setAttribute(this.svg, 'width', '100%');
        this.renderer.setAttribute(this.svg, 'height', '100%');
        this.renderer.setAttribute(this.svg, 'stroke', 'white');
        this.renderer.setAttribute(this.svg, 'version', 'http://www.w3.org/2000/svg');
        this.renderer.appendChild(this.element.nativeElement, this.svg);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.isMouseDown = true;

        this.path = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(this.path, 'stroke', 'black');
        this.renderer.setAttribute(this.path, 'fill', 'none');
        this.renderer.setAttribute(this.path, 'stroke-width', '5');
        this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');

        this.pathString = this.pencilService.
        pathBegin(event.clientX - this.element.nativeElement.offsetLeft, event.clientY);

        this.renderer.setAttribute(this.path, 'd', this.pathString);
        this.renderer.appendChild(this.svg, this.path);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.isMouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
    onClick(event: MouseEvent): void {
        if (this.isMouseDown) {
            this.pathString += this.pencilService.
            pathLine(event.clientX - this.element.nativeElement.offsetLeft, event.clientY);

            this.renderer.setAttribute(this.path, 'd', this.pathString);
            this.renderer.appendChild(this.svg, this.path);
        }
    }
}
