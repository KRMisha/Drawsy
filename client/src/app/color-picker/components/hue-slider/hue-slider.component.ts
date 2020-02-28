import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';

enum ColorGradient {
    Red = 'rgb(255, 0, 0)',
    Yellow = 'rgb(255, 255, 0)',
    Green = 'rgb(0, 255, 0)',
    Cyan = 'rgb(0, 255, 255)',
    Blue = 'rgb(0, 0, 255)',
    Pink = 'rgb(255, 0, 255)',
}

const canvasWidth = 206;
const canvasHeight = 20;
const radius = 8;

@Component({
    selector: 'app-hue-slider',
    templateUrl: './hue-slider.component.html',
    styleUrls: ['./hue-slider.component.scss'],
})
export class HueSliderComponent implements AfterViewInit {
    @ViewChild('huePicker', { static: false }) hueCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private isMouseInside = false;
    private isMouseDown = false;
    private mouseXPosition = 0;

    private hueColor = new Color();

    constructor(private colorPickerService: ColorPickerService) {
        this.colorPickerService.hueChanged$.subscribe(
            hue => {
                this.mouseXPosition = hue / Color.maxHue * canvasWidth;
            }
        )
    }

    ngAfterViewInit(): void {
        this.context = this.hueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.hueCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.mouseXPosition = this.colorPickerService.hue  / Color.maxHue * this.canvas.width;
        this.draw();
    }

    draw(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.context.clearRect(0, 0, width, height);

        const horizontalGradient = this.context.createLinearGradient(0, 0, width, 0);
        // tslint:disable: no-magic-numbers
        horizontalGradient.addColorStop(0 / 6, ColorGradient.Red);
        horizontalGradient.addColorStop(1 / 6, ColorGradient.Yellow);
        horizontalGradient.addColorStop(2 / 6, ColorGradient.Green);
        horizontalGradient.addColorStop(3 / 6, ColorGradient.Cyan);
        horizontalGradient.addColorStop(4 / 6, ColorGradient.Blue);
        horizontalGradient.addColorStop(5 / 6, ColorGradient.Pink);
        horizontalGradient.addColorStop(6 / 6, ColorGradient.Red);
        // tslint:enable: no-magic-numbers
        this.context.fillStyle = horizontalGradient;
        const padding = 0;
        this.context.fillRect(0, padding, width, height - 2 * padding);

        this.hueColor.setHsv(this.colorPickerService.hue, 1.0, 1.0);

        const circle = new Path2D();
        circle.arc(this.mouseXPosition, height / 2, radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.hueColor.toRgbString();
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
        
        this.mouseXPosition = Math.min(canvasWidth, Math.max(0, event.clientX - this.hueCanvas.nativeElement.getBoundingClientRect().x));
        const hue = (this.mouseXPosition / this.canvas.width) * Color.maxHue;
        this.colorPickerService.hue = hue;
        this.draw();
    }
}
