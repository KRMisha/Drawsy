import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { merge, Subscription } from 'rxjs';

const canvasWidth = 200;
const canvasHeight = 20;

@Component({
    selector: 'app-alpha-slider',
    templateUrl: './alpha-slider.component.html',
    styleUrls: ['./alpha-slider.component.scss'],
})
export class AlphaSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appAlphaPicker') alphaCanvas: ElementRef<HTMLCanvasElement>;

    private context: CanvasRenderingContext2D;

    private isLeftMouseButtonDown = false;
    private isMouseInside = false;
    private sliderPosition = 0;

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        const canvas = this.alphaCanvas.nativeElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.colorChangedSubscription = merge(
            this.colorPickerService.hueChanged$,
            this.colorPickerService.saturationChanged$,
            this.colorPickerService.valueChanged$,
            this.colorPickerService.alphaChanged$
        ).subscribe(() => {
            this.sliderPosition = this.colorPickerService.alpha * canvasWidth;
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseButtonDown) {
            this.updateAlpha(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside && event.button === MouseButton.Left) {
            this.isLeftMouseButtonDown = true;
            this.updateAlpha(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.isLeftMouseButtonDown = false;
        }
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        this.onMouseMove(TouchService.getMouseEventFromTouchEvent(event));
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        this.onMouseEnter();
        this.onMouseDown(TouchService.getMouseEventFromTouchEvent(event));
    }

    @HostListener('document:touchend', ['$event'])
    onTouchEnd(event: TouchEvent): void {
        this.onMouseUp(TouchService.getMouseEventFromTouchEvent(event));
        this.onMouseLeave();
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    private updateAlpha(event: MouseEvent): void {
        const mouseXPosition = event.clientX - this.alphaCanvas.nativeElement.getBoundingClientRect().x;
        const alpha = Math.min(canvasWidth, Math.max(0, mouseXPosition)) / canvasWidth;
        this.colorPickerService.alpha = alpha;
    }

    private draw(): void {
        this.context.clearRect(0, 0, canvasWidth, canvasHeight);

        const horizontalGradient = this.context.createLinearGradient(0, 0, canvasWidth, 0);
        const color = this.colorPickerService.getColor().clone();
        color.alpha = 0;
        horizontalGradient.addColorStop(0, color.toRgbaString());
        horizontalGradient.addColorStop(1, color.toRgbString());
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const radius = 8;
        const circle = new Path2D();
        circle.arc(this.sliderPosition, canvasHeight / 2, radius, 0, 2 * Math.PI);

        const lineWidth = 2;
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }
}
