import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ToolSelectorService } from 'src/app/services/drawing/tool-selector/tool-selector.service';

const leftClick = 0;
// const rightClick = 2;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('appSvg', { static: false }) private svg: ElementRef<SVGElement>;
    width = '100%';
    height = '100%';
    backgroundColor = 'rgb(255, 255, 255)';

    constructor(private renderer: Renderer2, private drawingService: DrawingService, private toolSelectorService: ToolSelectorService) {}

    ngAfterViewInit() {
        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.setRenderer(this.renderer);
        this.drawingService.element = this.svg.nativeElement;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolSelectorService.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (event.button === leftClick) {
            this.toolSelectorService.setMouseDown(true);
        }
        this.toolSelectorService.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        if (event.button === leftClick) {
            this.toolSelectorService.setMouseDown(false);
        }
        this.toolSelectorService.onMouseUp(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.toolSelectorService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.toolSelectorService.onKeyUp(event);
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(event: MouseEvent): void {
        this.toolSelectorService.setMouseInside(true);
        this.toolSelectorService.onEnter(event);
    }

    @HostListener('mouseleave', ['$event'])
    onLeave(event: MouseEvent): void {
        this.toolSelectorService.setMouseInside(false);
        this.toolSelectorService.onLeave(event);
    }
}
