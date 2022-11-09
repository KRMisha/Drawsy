import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Subscription } from 'rxjs';

const minZoomRatio = 0.1;
const maxZoomRatio = 3;
const zoomRatio = 0.05;

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
    scrollRatio = 1;
    private forceDetectChangesSubscription: Subscription;
    private drawingLoadedSubscription: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef, private drawingService: DrawingService) {}

    ngOnInit(): void {
        this.forceDetectChangesSubscription = this.drawingService.forceDetectChanges$.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.drawingLoadedSubscription = this.drawingService.drawingLoaded$.subscribe(() => {
            this.scrollRatio = 1;
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
            this.scrollRatio -= Math.sign(event.deltaY) * zoomRatio;
            this.scrollRatio = Math.min(Math.max(this.scrollRatio, minZoomRatio), maxZoomRatio);
        }
    }

    get ratio(): number {
        return this.scrollRatio;
    }
}
