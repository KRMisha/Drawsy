import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { Vec2 } from 'src/app/classes/vec2';

enum ColorString {
    OpaqueWhite = 'rgba(255, 255, 255, 1)',
    TransparentWhite = 'rgba(255, 255, 255, 0)',
    OpaqueBlack = 'rgba(0, 0, 0, 1)',
    TransparentBlack = 'rgba(0, 0, 0, 0)',
}

const canvasWidth = 250;
const canvasHeight = 160;

@Component({
    selector: 'app-color-field',
    templateUrl: './color-field.component.html',
    styleUrls: ['./color-field.component.scss'],
})
export class ColorFieldComponent implements AfterViewInit {
    @ViewChild('saturationValuePicker', { static: false }) saturationValueCanvas: ElementRef<HTMLCanvasElement>;

    @Output() saturationValueChange: EventEmitter<[number, number]> = new EventEmitter();

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    // tslint:disable-next-line: variable-name
    private _hue = 0;
    @Input()
    set hue(hue: number) {
        this._hue = hue;
        if (this.canvas !== undefined) {
            this.draw();
        }
    }

    private saturation = 0;
    @Input()
    set setSaturation(saturation: number) {
        this.saturation = saturation;
        this.mousePosition.x = saturation * canvasWidth;
        if (this.canvas !== undefined) {
            this.draw();
        }
    }

    private value = 1;
    @Input()
    set setValue(value: number) {
        this.value = value;
        this.mousePosition.y = (1 - value) * canvasHeight;
        if (this.canvas !== undefined) {
            this.draw();
        }
    }

    private isMouseDown = false;
    private mousePosition: Vec2 = { x: 0, y: canvasHeight };
    private isMouseInside = false;

    private color = new Color();

    constructor() {
        this.color.red = 0;
        this.color.green = 0;
        this.color.blue = 0;
    }

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.saturationValueCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.draw();
    }

    draw(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const color = new Color();
        color.setHsv(this._hue, 1, 1);

        const colorStr = color.toRgbString();
        this.context.fillStyle = colorStr;
        this.context.fillRect(0, 0, width, height);

        const horizontalGradient = this.context.createLinearGradient(0, 0, width, 0);
        horizontalGradient.addColorStop(0, ColorString.OpaqueWhite);
        horizontalGradient.addColorStop(1, ColorString.TransparentWhite);
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, width, height);

        const verticalGradient = this.context.createLinearGradient(0, 0, 0, height);
        verticalGradient.addColorStop(0, ColorString.TransparentBlack);
        verticalGradient.addColorStop(1, ColorString.OpaqueBlack);
        this.context.fillStyle = verticalGradient;
        this.context.fillRect(0, 0, width, height);

        this.color.setHsv(this._hue, this.saturation, this.value);

        const circle = new Path2D();
        circle.arc(this.mousePosition.x, this.mousePosition.y, 10, 0, 2 * Math.PI);
        this.context.fillStyle = this.color.toRgbString();
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = ColorString.OpaqueWhite;
        this.context.stroke(circle);
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.isMouseDown = true;
            this.updateColor(event);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.updateColor(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.isMouseInside = false;
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.isMouseInside = true;
    }

    updateColor(event: MouseEvent): void {
        if (!this.isMouseDown || !this.isMouseInside || event.offsetY >= this.canvas.height) {
            return;
        }

        this.saturation = event.offsetX / this.canvas.width;
        this.value = 1.0 - event.offsetY / this.canvas.height;
        this.mousePosition.x = event.offsetX;
        this.mousePosition.y = event.offsetY;
        this.draw();
        this.saturationValueChange.emit([this.saturation, this.value]);
    }
}
