import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from '@app/app/services/theme.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('appBackground') private background: ElementRef<HTMLDivElement>;
    @ViewChild('appDrawingContainer') private drawingContainer: ElementRef<HTMLDivElement>;

    private forceDetectChangesSubscription: Subscription;
    private drawingLoadedSubscription: Subscription;
    private isRightMouseButtonDown: boolean;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private drawingService: DrawingService,
        private themeService: ThemeService
    ) {}

    ngOnInit(): void {
        this.forceDetectChangesSubscription = this.drawingService.forceDetectChanges$.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(() => {
            this.drawingService.resetCanvasView();
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
        this.drawingService.drawingContainer = this.drawingContainer;
        this.themeService.background = this.background;
    }

    ngOnDestroy(): void {
        this.forceDetectChangesSubscription.unsubscribe();
        this.drawingLoadedSubscription.unsubscribe();
    }

    onScroll(event: WheelEvent): void {
        if (event.ctrlKey) {
            event.preventDefault();

            const isZoomOut = Math.sign(event.deltaY) === 1;
            isZoomOut ? this.drawingService.zoomOut() : this.drawingService.zoomIn();
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isRightMouseButtonDown) {
            this.applyClampedCanvasTranslation(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Right) {
            this.isRightMouseButtonDown = true;
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Right) {
            this.isRightMouseButtonDown = false;
        }
    }

    get isMobileDevice(): boolean {
        return TouchService.isMobileDevice;
    }

    private applyClampedCanvasTranslation(event: MouseEvent): void {
        const marginDivider = 2;
        const canvasMargins = Vec2.scale(this.drawingService.zoomRatio / marginDivider, this.drawingService.dimensions);
        this.drawingService.translation = {
            x: Math.min(Math.max(this.drawingService.translation.x + event.movementX, -canvasMargins.x), canvasMargins.x),
            y: Math.min(Math.max(this.drawingService.translation.y + event.movementY, -canvasMargins.y), canvasMargins.y),
        };
    }
}
