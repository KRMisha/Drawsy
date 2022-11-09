import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { Subscription } from 'rxjs';

const minZoomRatio = 0.1;
const maxZoomRatio = 3;
const zoomRatio = 0.05;
// const canvasMargin = 400;

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild('drawingContainer') drawingContainer: ElementRef;

    scrollRatio = 1;
    private forceDetectChangesSubscription: Subscription;
    private drawingLoadedSubscription: Subscription;
    private isRightMouseButtonHeld: boolean;
    private translation: Vec2 = { x: 0, y: 0 };

    constructor(private changeDetectorRef: ChangeDetectorRef, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.forceDetectChangesSubscription = this.drawingService.forceDetectChanges$.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(() => {
            this.scrollRatio = 1;
            this.setCanvasTranslation({ x: 0, y: 0 });
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

    ngOnDestroy(): void {
        this.forceDetectChangesSubscription.unsubscribe();
        this.drawingLoadedSubscription.unsubscribe();
    }

    onScroll(event: WheelEvent): void {
        if (event.ctrlKey) {
            event.preventDefault();

            // Apply zoom, and then apply translation
            this.setCanvasTranslation({ x: 0, y: 0 });
            this.scrollRatio -= Math.sign(event.deltaY) * zoomRatio;
            this.scrollRatio = Math.min(Math.max(this.scrollRatio, minZoomRatio), maxZoomRatio);
            this.setCanvasTranslation(Vec2.scale(this.scrollRatio, this.translation));
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isRightMouseButtonHeld) {
            this.clampCanvasMargin(event);
            this.setCanvasTranslation(Vec2.scale(this.scrollRatio, this.translation));
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Right) {
            this.isRightMouseButtonHeld = true;
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Right) {
            this.isRightMouseButtonHeld = false;
        }
    }

    private clampCanvasMargin(event: MouseEvent): void {
        this.translation.x = Math.min(
            Math.max(this.translation.x + event.movementX / this.scrollRatio, -this.drawingService.dimensions.x / 2),
            this.drawingService.dimensions.x / 2
        );
        this.translation.y = Math.min(
            Math.max(this.translation.y + event.movementY / this.scrollRatio, -this.drawingService.dimensions.y / 2),
            this.drawingService.dimensions.y / 2
        );
    }

    private setCanvasTranslation(translation: Vec2): void {
        this.drawingContainer.nativeElement.setAttribute('style', `transform: translate(${translation.x}px, ${translation.y}px);`);
    }

    get ratio(): number {
        return this.scrollRatio;
    }

    get isMobileDevice(): boolean {
        return TouchService.isMobileDevice;
    }
}
