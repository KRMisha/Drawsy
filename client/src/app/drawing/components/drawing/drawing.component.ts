import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { TouchService } from '@app/shared/services/touch.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-drawing',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('appDrawingRoot') private drawingRoot: ElementRef<SVGSVGElement>;
    @ViewChild('appDrawingContent')
    private svgDrawingContent: ElementRef<SVGGElement>;
    @ViewChild('appUserInterfaceContent')
    private svgUserInterfaceContent: ElementRef<SVGGElement>;

    private forceDetectChangesSubscription: Subscription;
    private toggleGridSubscription: Subscription;
    private increaseGridSizeSubscription: Subscription;
    private decreaseGridSizeSubscription: Subscription;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private currentToolService: CurrentToolService,
        private gridService: GridService,
        private shortcutService: ShortcutService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.forceDetectChangesSubscription = this.drawingService.forceDetectChanges$.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.toggleGridSubscription = this.shortcutService.toggleGrid$.subscribe(() => {
            this.gridService.toggleDisplay();
        });
        this.increaseGridSizeSubscription = this.shortcutService.increaseGridSize$.subscribe(() => {
            this.gridService.increaseSize();
        });
        this.decreaseGridSizeSubscription = this.shortcutService.decreaseGridSize$.subscribe(() => {
            this.gridService.decreaseSize();
        });

        // @HostListener does not support setting the passive option needed to call event.preventDefault() on a passive event
        document.addEventListener(
            'wheel',
            (event: WheelEvent) => {
                this.onScroll(event);
            },
            { passive: false }
        );
    }

    ngAfterViewInit(): void {
        this.drawingService.drawingRoot = this.drawingRoot.nativeElement;
        this.drawingService.svgDrawingContent = this.svgDrawingContent.nativeElement;
        this.drawingService.svgUserInterfaceContent = this.svgUserInterfaceContent.nativeElement;
        this.drawingService.reappendStoredElements();
        this.drawingService.saveDrawingToStorage();
    }

    ngOnDestroy(): void {
        this.currentToolService.onFocusOut();

        this.forceDetectChangesSubscription.unsubscribe();
        this.toggleGridSubscription.unsubscribe();
        this.increaseGridSizeSubscription.unsubscribe();
        this.decreaseGridSizeSubscription.unsubscribe();

        delete this.drawingService.drawingRoot;
        delete this.drawingService.svgDrawingContent;
        delete this.drawingService.svgUserInterfaceContent;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onMouseMove(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onMouseDown(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onMouseUp(event);
        }
    }

    onScroll(event: WheelEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onScroll(event);
        }
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        this.onMouseMove(TouchService.getMouseEventFromTouchEvent(event));
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        const mouseEventMock = TouchService.getMouseEventFromTouchEvent(event);
        this.onMouseEnter(mouseEventMock);
        this.onMouseDown(mouseEventMock);
    }

    @HostListener('document:touchend', ['$event'])
    onTouchEnd(event: TouchEvent): void {
        const mouseEventMock = TouchService.getMouseEventFromTouchEvent(event);
        this.onMouseUp(mouseEventMock);
        this.onMouseLeave(mouseEventMock);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onMouseDoubleClick(event);
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onKeyDown(event);
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        if (!this.modalService.isModalPresent) {
            this.currentToolService.onKeyUp(event);
        }
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.currentToolService.onMouseEnter(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentToolService.onMouseLeave(event);
    }

    @HostListener('focus')
    onFocusIn(): void {
        this.currentToolService.onFocusIn();
    }

    @HostListener('blur')
    onFocusOut(): void {
        this.currentToolService.onFocusOut();
    }

    get width(): number {
        return this.drawingService.dimensions.x * this.drawingService.zoomRatio;
    }

    get height(): number {
        return this.drawingService.dimensions.y * this.drawingService.zoomRatio;
    }

    get viewBox(): string {
        return `0 0 ${this.drawingService.dimensions.x} ${this.drawingService.dimensions.y}`;
    }

    get drawingLabels(): string {
        return this.drawingService.labels.join(',');
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
