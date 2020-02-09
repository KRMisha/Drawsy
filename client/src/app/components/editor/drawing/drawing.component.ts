import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { Vec2 } from 'src/app/classes/vec2/vec2';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ToolSelectorService } from 'src/app/services/drawing/tool-selector/tool-selector.service';

const leftClick = 0;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('appSvg', { static: false }) private svg: ElementRef<SVGElement>;
    dimensions: Vec2;
    backgroundColor: Color;

    constructor(private renderer: Renderer2, private drawingService: DrawingService, private toolSelectorService: ToolSelectorService) {}

    ngOnInit() {
        this.dimensions = this.drawingService.drawingDimensions;
        this.backgroundColor = this.drawingService.backgroundColor;

        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.setRenderer(this.renderer);
    }

    ngAfterViewInit() {
        this.drawingService.rootElement = this.svg.nativeElement;
        this.drawingService.reappendStoredElements();
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

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.toolSelectorService.onMouseDoubleClick(event);
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

    getWidth(): number {
        return this.drawingService.drawingDimensions.x;
    }

    getHeight(): number {
        return this.drawingService.drawingDimensions.y;
    }

    getBackgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }
}
