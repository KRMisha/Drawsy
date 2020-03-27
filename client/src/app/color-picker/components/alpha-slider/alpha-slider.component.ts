import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { merge, Subscription } from 'rxjs';

const canvasWidth = 202;
const canvasHeight = 20;
const radius = 8;

@Component({
    selector: 'app-alpha-slider',
    templateUrl: './alpha-slider.component.html',
    styleUrls: ['./alpha-slider.component.scss'],
})
export class AlphaSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appAlphaPicker') alphaCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private color = new Color();

    private isLeftMouseButtonDown = false;
    private isMouseInside = false;
    private sliderPosition = 0;

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.context = this.alphaCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.alphaCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.sliderPosition = this.colorPickerService.alpha * canvasWidth;

        this.colorChangedSubscription = merge(
            this.colorPickerService.hueChanged$,
            this.colorPickerService.saturationChanged$,
            this.colorPickerService.valueChanged$,
            this.colorPickerService.alphaChanged$
        ).subscribe(() => {
            this.color = this.colorPickerService.getColor();
            this.sliderPosition = this.color.alpha * canvasWidth;
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.updateAlpha(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.isLeftMouseButtonDown = true;
        }
        this.updateAlpha(event);
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        this.isLeftMouseButtonDown = false;
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
        if (!this.isLeftMouseButtonDown) {
            return;
        }

        const mouseXPosition = event.clientX - this.alphaCanvas.nativeElement.getBoundingClientRect().x;
        const alpha = Math.min(canvasWidth, Math.max(0, mouseXPosition)) / this.canvas.width;
        this.colorPickerService.alpha = alpha;
    }

    private draw(): void {
        this.context.clearRect(0, 0, canvasWidth, canvasHeight);
        const horizontalGradient = this.context.createLinearGradient(0, 0, canvasWidth, 0);
        horizontalGradient.addColorStop(0, `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, 0)`);
        horizontalGradient.addColorStop(1, this.color.toRgbString());
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const circle = new Path2D();
        circle.arc(this.sliderPosition, canvasHeight / 2, radius, 0, 2 * Math.PI);
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }
}
