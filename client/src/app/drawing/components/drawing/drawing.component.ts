import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ButtonId } from 'src/app/classes/button-id';
import { DrawingService } from 'src/app/drawing/services/drawing.service';
import { ToolSelectorService } from 'src/app/tools/services/tool-selector.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('appDrawingContent', { static: false }) private svg: ElementRef<SVGElement>;

    constructor(private renderer: Renderer2, private drawingService: DrawingService, private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.setRenderer(this.renderer);
    }

    ngAfterViewInit(): void {
        this.drawingService.rootElement = this.svg.nativeElement;
        this.drawingService.reappendStoredElements();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolSelectorService.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (event.button === ButtonId.Left) {
            this.toolSelectorService.setMouseDown(true);
        }
        this.toolSelectorService.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === ButtonId.Left) {
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
        return this.drawingService.getDrawingDimensions().x;
    }

    getHeight(): number {
        return this.drawingService.getDrawingDimensions().y;
    }

    getBackgroundColor(): string {
        return this.drawingService.getBackgroundColor().toRgbaString();
    }
}
