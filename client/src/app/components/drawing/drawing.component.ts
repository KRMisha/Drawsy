import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent {
    private isMouseDown = false;
    private lastMouseX: number;
    private lastMouseY: number;
    
    private svg = this.renderer.createElement('svg', 'svg');
    // private path: any;
    // private pathAttribute: string;

    constructor(private renderer: Renderer2, private element: ElementRef) {
        this.renderer.setAttribute(this.svg, 'version', '1.1');
        this.renderer.setAttribute(this.svg, 'baseProfile', 'full');
        this.renderer.setAttribute(this.svg, 'width', '100%');
        this.renderer.setAttribute(this.svg, 'height', '100%');
        this.renderer.setAttribute(this.svg, 'version', 'http://www.w3.org/2000/svg');
        this.renderer.appendChild(this.element.nativeElement, this.svg);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.isMouseDown = true;
        this.lastMouseX = event.clientX - this.element.nativeElement.offsetLeft;
        this.lastMouseY = event.clientY;

        // this.pathAttribute = `M${this.lastMouseX} ${this.lastMouseY} `;
        // this.path = this.renderer.createElement('path', 'svg')
        // this.renderer.setAttribute(this.path, 'stroke', 'black');
        // this.renderer.setAttribute(this.path, 'stroke-width', '5');
        // this.renderer.appendChild(this.svg, this.path);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.isMouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
    onClick(event: MouseEvent): void {
        if (this.isMouseDown) {
            // const rect = this.renderer.createElement('rect', 'svg');
            // this.renderer.setAttribute(rect, 'width', '20');
            // this.renderer.setAttribute(rect, 'height', '20');
            // this.renderer.setAttribute(rect, 'background-color', 'blue');
            // this.renderer.setAttribute(rect, 'x', `${event.clientX - this.element.nativeElement.offsetLeft}`);
            // this.renderer.setAttribute(rect, 'y', `${event.clientY}`);
            // this.renderer.appendChild(this.svg, rect);

            const line = this.renderer.createElement('line', 'svg');
            this.renderer.setAttribute(line, 'x1', `${this.lastMouseX}`);
            this.renderer.setAttribute(line, 'x2', `${event.clientX - this.element.nativeElement.offsetLeft}`);
            this.renderer.setAttribute(line, 'y1', `${this.lastMouseY}`);
            this.renderer.setAttribute(line, 'y2', `${event.clientY}`);
            this.renderer.setAttribute(line, 'stroke', 'black');
            this.renderer.setAttribute(line, 'stroke-width', '3');
            this.renderer.appendChild(this.svg, line);

            // this.pathAttribute += 
                // `M${event.clientX - this.element.nativeElement.offsetLeft - this.lastMouseX} ${event.clientY - this.lastMouseY} `;

            // this.renderer.setAttribute(this.path, 'd', `${this.pathAttribute}`);

            this.lastMouseX = event.clientX - this.element.nativeElement.offsetLeft;
            this.lastMouseY = event.clientY;
        }
    }
}
