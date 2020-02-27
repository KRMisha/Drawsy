import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';

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


    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private isMouseDown = false;
    private mousePosition: Vec2 = { x: 0, y: canvasHeight };
    private isMouseInside = false;


    constructor(private colorPickerService: ColorPickerService) {
        this.colorPickerService.hueChanged$.subscribe(
            hue => {
                this.draw();
            }
        );
        this.colorPickerService.saturationChanged$.subscribe(
            saturation => {
                this.mousePosition.x = saturation * canvasWidth;
                this.draw();
            }
        );
        this.colorPickerService.valueChanged$.subscribe(
            value => {
                this.mousePosition.y = canvasHeight * (1 - value);
                this.draw();
            }
        );
    }

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.saturationValueCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.mousePosition.y = this.canvas.height * (1 - this.colorPickerService.value);
        this.mousePosition.x = this.colorPickerService.saturation * this.canvas.width;
        this.draw();
    }

    draw(): void {
        if (this.canvas === undefined) {
            return;
        }
        
        const color = new Color();
        color.setHsv(this.colorPickerService.hue, 1, 1);

        const colorStr = color.toRgbString();
        this.context.fillStyle = colorStr;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const horizontalGradient = this.context.createLinearGradient(0, 0, canvasWidth, 0);
        horizontalGradient.addColorStop(0, ColorString.OpaqueWhite);
        horizontalGradient.addColorStop(1, ColorString.TransparentWhite);
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const verticalGradient = this.context.createLinearGradient(0, 0, 0, canvasHeight);
        verticalGradient.addColorStop(0, ColorString.TransparentBlack);
        verticalGradient.addColorStop(1, ColorString.OpaqueBlack);
        this.context.fillStyle = verticalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        color.setHsv(this.colorPickerService.hue, this.colorPickerService.saturation, this.colorPickerService.value);

        const circle = new Path2D();
        const radius = 10;
        circle.arc(this.mousePosition.x, this.mousePosition.y, radius, 0, 2 * Math.PI);
        this.context.fillStyle = color.toRgbString();
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

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    updateColor(event: MouseEvent): void {
        if (!this.isMouseDown || !this.isMouseInside) {
            return;
        }
        
        this.mousePosition.x = event.offsetX;
        this.mousePosition.y = event.offsetY;
        this.colorPickerService.saturation = event.offsetX / this.canvas.width;
        this.colorPickerService.value = 1.0 - event.offsetY / this.canvas.height;
        this.draw();
    }
}
