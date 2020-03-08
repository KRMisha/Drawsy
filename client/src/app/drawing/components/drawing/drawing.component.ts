import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ModalService } from '@app/modals/services/modal.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit, AfterViewInit {
    @ViewChild('appDrawingRoot', { static: false }) private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appDrawingContent', { static: false }) private svgDrawingContent: ElementRef<SVGGElement>;
    @ViewChild('appUserInterfaceContent', { static: false }) private svgUserInterfaceContent: ElementRef<SVGGElement>;
    @ViewChild('appGridPattern', { static: false }) private svgGridPattern: ElementRef<SVGPatternElement>;
    @ViewChild('appGridPath', { static: false }) private svgGridPath: ElementRef<SVGPathElement>;
    private areShortcutsEnabled = true;

    constructor(
        private renderer: Renderer2,
        private drawingService: DrawingService,
        private toolSelectorService: ToolSelectorService,
        private gridService: GridService,
        private modalService: ModalService,
    ) {}

    ngOnInit(): void {
        this.drawingService.renderer = this.renderer;
        this.toolSelectorService.setRenderer(this.renderer);
    }

    ngAfterViewInit(): void {
        this.drawingService.drawingRoot = this.drawingRoot.nativeElement;
        this.drawingService.svgDrawingContent = this.svgDrawingContent.nativeElement;
        this.drawingService.svgUserInterfaceContent = this.svgUserInterfaceContent.nativeElement;
        this.gridService.setElementRoots(this.svgGridPattern.nativeElement, this.svgGridPath.nativeElement);
        this.drawingService.reappendStoredElements();
        this.toolSelectorService.afterDrawingInit();
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
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
                case 'g':
                    this.gridService.toggleGrid();
                    break;
                case '+':
                    if (event.shiftKey) {
                        this.gridService.raiseGridSize();
                    }
                    break;
                case '-':
                    this.gridService.lowerGridSize();
                    break;
            }
        }
    }

    @HostListener('document:focusin', ['$event'])
    onFocusIn(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement) {
            this.areShortcutsEnabled = false;
        }
    }

    @HostListener('document:focusout', ['$event'])
    onFocusOut(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement) {
            this.areShortcutsEnabled = true;
        }
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
        return this.drawingService.dimensions.x;
    }

    getHeight(): number {
        return this.drawingService.dimensions.y;
    }

    getBackgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }
}
