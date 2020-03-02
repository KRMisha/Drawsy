import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('appDrawingRoot', { static: false }) private drawingRoot: ElementRef<SVGSVGElement>;
    @Input() isPreview: boolean;

    constructor(private renderer: Renderer2, private drawingService: DrawingService, private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.setRenderer(this.renderer);
    }

    ngAfterViewInit(): void {
        this.drawingService.setTarget(this.drawingRoot.nativeElement);
        this.drawingService.reappendStoredElements();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        if (event.button === ButtonId.Left) {
            this.toolSelectorService.setMouseDown(true);
        }
        this.toolSelectorService.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        if (event.button === ButtonId.Left) {
            this.toolSelectorService.setMouseDown(false);
        }
        this.toolSelectorService.onMouseUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.onMouseDoubleClick(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.onKeyUp(event);
    }

    @HostListener('mouseenter', ['$event'])
    onEnter(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.setMouseInside(true);
        this.toolSelectorService.onEnter(event);
    }

    @HostListener('mouseleave', ['$event'])
    onLeave(event: MouseEvent): void {
        if (this.isPreview) {
            return;
        }

        this.toolSelectorService.setMouseInside(false);
        this.toolSelectorService.onLeave(event);
    }

    getViewBox(): string {
        return `0 0 ${this.drawingService.getDrawingDimensions().x} ${this.drawingService.getDrawingDimensions().y}`;
    }

    getWidth(): string {
        return this.isPreview ? '100%' : this.drawingService.getDrawingDimensions().x.toString();
    }

    getHeight(): string {
        return this.isPreview ? '100%' : this.drawingService.getDrawingDimensions().y.toString();
    }

    getBackgroundColor(): string {
        return this.drawingService.getBackgroundColor().toRgbaString();
    }
}
