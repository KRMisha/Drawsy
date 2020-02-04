import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ToolSelectorService } from 'src/app/services/drawing/tool-selector/tool-selector.service';

const leftClick = 0;
// const rightClick = 2;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent {
    private svg: SVGElement;

    constructor(
        private renderer: Renderer2,
        private element: ElementRef,
        private drawingService: DrawingService,
        private toolSelectorService: ToolSelectorService,
    ) {
        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.renderer = this.renderer;
        this.drawingService.element = this.svg;
        this.createSvg();
    }

    @HostListener('mousemove', ['$event'])
    onClick(event: MouseEvent): void {
        this.toolSelectorService.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (event.button === leftClick) {
            this.toolSelectorService.setMouseDown(true);
        }
        this.toolSelectorService.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        if (event.button === leftClick) {
            this.toolSelectorService.setMouseDown(false);
        }
        this.toolSelectorService.onMouseUp(event);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelectorService.onKeyDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectorService.onKeyUp(event);
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(event: MouseEvent): void {
        this.toolSelectorService.setMouseDown(false);
        this.toolSelectorService.onEnter(event);
    }

    @HostListener('mouseleave', ['$event'])
    onLeave(event: MouseEvent): void {
        this.toolSelectorService.setMouseDown(false);
        this.toolSelectorService.onLeave(event);
    }

    private createSvg() {
        this.svg = this.renderer.createElement('svg', 'svg');
        this.renderer.setAttribute(this.svg, 'version', '1.1');
        this.renderer.setAttribute(this.svg, 'baseProfile', 'full');
        this.renderer.setAttribute(this.svg, 'width', '100%');
        this.renderer.setAttribute(this.svg, 'height', '100%');
        this.renderer.setAttribute(this.svg, 'stroke', 'white');
        this.renderer.setAttribute(this.svg, 'version', 'http://www.w3.org/2000/svg');
        this.renderer.appendChild(this.element.nativeElement, this.svg);
    }
}
