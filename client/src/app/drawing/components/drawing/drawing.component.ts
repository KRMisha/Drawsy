import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('appDrawingRoot') private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appDrawingContent') private svgDrawingContent: ElementRef<SVGGElement>;
    @ViewChild('appUserInterfaceContent') private svgUserInterfaceContent: ElementRef<SVGGElement>;

    constructor(private drawingService: DrawingService, private currentToolService: CurrentToolService, private gridService: GridService) {}

    ngAfterViewInit(): void {
        this.drawingService.drawingRoot = this.drawingRoot.nativeElement;
        this.drawingService.svgDrawingContent = this.svgDrawingContent.nativeElement;
        this.drawingService.svgUserInterfaceContent = this.svgUserInterfaceContent.nativeElement;
        this.svgUserInterfaceContent.nativeElement.setAttribute('pointer-events', 'none');
        this.drawingService.reappendStoredElements();
        this.currentToolService.afterDrawingInit();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentToolService.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (event.button === ButtonId.Left) {
            this.currentToolService.setMouseDown(true);
        }
        this.currentToolService.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === ButtonId.Left) {
            this.currentToolService.setMouseDown(false);
        }
        this.currentToolService.onMouseUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.currentToolService.onMouseDoubleClick(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.currentToolService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.currentToolService.onKeyUp(event);
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(event: MouseEvent): void {
        this.currentToolService.setMouseInsideDrawing(true);
        this.currentToolService.onEnter(event);
    }

    @HostListener('mouseleave', ['$event'])
    onLeave(event: MouseEvent): void {
        this.currentToolService.setMouseInsideDrawing(false);
        this.currentToolService.onLeave(event);
    }

    get width(): number {
        return this.drawingService.dimensions.x;
    }

    get height(): number {
        return this.drawingService.dimensions.y;
    }

    get viewBox(): string {
        return `0 0 ${this.width} ${this.height}`;
    }

    get isGridDisplayEnabled(): boolean {
        return this.gridService.isDisplayEnabled;
    }

    get gridSize(): number {
        return this.gridService.size;
    }

    get gridOpacity(): number {
        return this.gridService.opacity;
    }

    get backgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }
}
