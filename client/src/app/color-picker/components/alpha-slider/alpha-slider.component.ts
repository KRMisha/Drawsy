import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Subscription } from 'rxjs';

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

    private isMouseInside = false;
    private isMouseDown = false;
    private mouseXPosition = 0;

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.context = this.alphaCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.alphaCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.mouseXPosition = this.colorPickerService.alpha * canvasWidth;

        this.colorChangedSubscription = this.colorPickerService.colorChanged$.subscribe((color: Color) => {
            this.color = color;
            this.mouseXPosition = this.color.alpha * canvasWidth;
            this.draw();
        });
        this.color = this.colorPickerService.getColor();
        this.draw();
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.update(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.isMouseDown = true;
        }
        this.update(event);
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        this.isMouseDown = false;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    private update(event: MouseEvent): void {
        if (!this.isMouseDown) {
            return;
        }

        this.mouseXPosition = Math.min(canvasWidth, Math.max(0, event.clientX - this.alphaCanvas.nativeElement.getBoundingClientRect().x));
        const alpha = this.mouseXPosition / this.canvas.width;
        this.colorPickerService.alpha = alpha;
        this.draw();
    }

    private draw(): void {
        this.context.clearRect(0, 0, canvasWidth, canvasHeight);
        const horizontalGradient = this.context.createLinearGradient(0, 0, canvasWidth, 0);
        horizontalGradient.addColorStop(0, `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, 0)`);
        horizontalGradient.addColorStop(1, this.color.toRgbString());
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const circle = new Path2D();
        circle.arc(this.mouseXPosition, canvasHeight / 2, radius, 0, 2 * Math.PI);
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }
}
