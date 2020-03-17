import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import { ModalService } from '@app/modals/services/modal.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('appDrawingRoot', { static: false }) private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appDrawingContent', { static: false }) private svgDrawingContent: ElementRef<SVGGElement>;
    @ViewChild('appUserInterfaceContent', { static: false }) private svgUserInterfaceContent: ElementRef<SVGGElement>;
    @ViewChild('appGridPattern', { static: false }) private svgGridPattern: ElementRef<SVGPatternElement>;
    @ViewChild('appGridPath', { static: false }) private svgGridPath: ElementRef<SVGPathElement>;
    private areShortcutsEnabled = true;

    constructor(
        private drawingService: DrawingService,
        private currentToolService: CurrentToolService,
        private gridService: GridService,
        private modalService: ModalService,
    ) {}

    ngAfterViewInit(): void {
        this.drawingService.drawingRoot = this.drawingRoot.nativeElement;
        this.drawingService.svgDrawingContent = this.svgDrawingContent.nativeElement;
        this.drawingService.svgUserInterfaceContent = this.svgUserInterfaceContent.nativeElement;
        this.svgUserInterfaceContent.nativeElement.setAttribute('pointer-events', 'none');
        this.gridService.setElementRoots(this.svgGridPattern.nativeElement, this.svgGridPath.nativeElement);
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
        if (!this.modalService.isModalPresent && this.areShortcutsEnabled) {
            switch (event.key) {
                case 'g':
                    this.gridService.toggleGrid();
                    break;
                case '+':
                    this.gridService.increaseGridSize();
                    break;
                case '-':
                    this.gridService.decreaseGridSize();
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

    getWidth(): number {
        return this.drawingService.dimensions.x;
    }

    getHeight(): number {
        return this.drawingService.dimensions.y;
    }

    getViewBox(): string {
        return `0 0 ${this.getWidth()} ${this.getHeight()}`;
    }

    getBackgroundColor(): string {
        return this.drawingService.backgroundColor.toRgbaString();
    }
}
