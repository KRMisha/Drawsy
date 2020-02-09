import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Color, maxHue } from 'src/app/classes/color/color';

enum ColorGradient {
    Red = 'rgb(255, 0, 0)',
    Yellow = 'rgb(255, 255, 0)',
    Green = 'rgb(0, 255, 0)',
    Cyan = 'rgb(0, 255, 255)',
    Blue = 'rgb(0, 0, 255)',
    Pink = 'rgb(255, 0, 255)',
}

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @Output() hueChange: EventEmitter<number> = new EventEmitter();
    @ViewChild('huePicker', { static: false }) hueCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private isMouseDown = false;
    private mouseXPosition = 0;

    private isMouseInside = false;

    hue = 0;
    @Input()
    set setHue(hue: number) {
        if (this.canvas !== undefined) {
            this.hue = hue;
            this.mouseXPosition = (hue / 360) * 250;
            this.draw();
        }
    }

    ngAfterViewInit(): void {
        this.context = this.hueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.hueCanvas.nativeElement;
        this.canvas.width = 250;
        this.canvas.height = 21;
        this.draw();
    }

    draw(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.context.clearRect(0, 0, width, height);

        const horizontalGradient = this.context.createLinearGradient(0, 0, width, 0);
        horizontalGradient.addColorStop(0 / 6, ColorGradient.Red);
        horizontalGradient.addColorStop(1 / 6, ColorGradient.Yellow);
        horizontalGradient.addColorStop(2 / 6, ColorGradient.Green);
        horizontalGradient.addColorStop(3 / 6, ColorGradient.Cyan);
        horizontalGradient.addColorStop(4 / 6, ColorGradient.Blue);
        horizontalGradient.addColorStop(5 / 6, ColorGradient.Pink);
        horizontalGradient.addColorStop(6 / 6, ColorGradient.Red);
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 7, width, height - 14);

        const hueColor = new Color();
        hueColor.setHsv(this.hue, 1.0, 1.0);

        const circle = new Path2D();
        circle.arc(this.mouseXPosition, height / 2, 8, 0, 2 * Math.PI);
        this.context.fillStyle = hueColor.toRgbString();
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.isMouseDown = true;
            this.update(event);
        }
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        this.isMouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
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
        if (!this.isMouseDown || !this.isMouseInside) {
            return;
        }

        this.mouseXPosition = event.offsetX;
        this.hue = (this.mouseXPosition / this.canvas.width) * maxHue;
        this.draw();
        this.hueChange.emit(this.hue);
    }
}
