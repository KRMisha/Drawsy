import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';

const canvasWidth = 204;
const canvasHeight = 20;
const radius = 8;

@Component({
    selector: 'app-alpha-slider',
    templateUrl: './alpha-slider.component.html',
    styleUrls: ['./alpha-slider.component.scss'],
})
export class AlphaSliderComponent implements AfterViewInit {
    @ViewChild('appAlphaPicker', { static: false }) alphaCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private color = new Color();

    private isMouseInside = false;
    private isMouseDown = false;
    private mouseXPosition = 0;

    constructor(private colorPickerService: ColorPickerService) {
        this.colorPickerService.colorChanged$.subscribe((color: Color) => {
            this.color = color;
            this.mouseXPosition = this.color.alpha * canvasWidth;
            this.draw();
        });
    }

    ngAfterViewInit(): void {
        this.context = this.alphaCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.alphaCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.mouseXPosition = this.colorPickerService.alpha * canvasWidth;
        this.draw();
    }

    private draw(): void {
        if (this.context === undefined) {
            return;
        }

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

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.update(event);
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    update(event: MouseEvent): void {
        if (!this.isMouseDown) {
            return;
        }

        this.mouseXPosition = Math.min(canvasWidth, Math.max(0, event.clientX - this.alphaCanvas.nativeElement.getBoundingClientRect().x));
        const alpha = this.mouseXPosition / this.canvas.width;
        this.colorPickerService.alpha = alpha;
        this.draw();
    }
}
