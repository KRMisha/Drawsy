import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Subscription } from 'rxjs';

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
export class ColorFieldComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appSaturationValuePicker', { static: false }) saturationValueCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private isMouseDown = false;
    private sliderPosition: Vec2 = { x: 0, y: canvasHeight };
    private isMouseInside = false;

    private hueChangedSubscription: Subscription;
    private saturationChangedSubscription: Subscription;
    private valueChangedSubscription: Subscription;

    private isSliderPositionClipedToBottom = false;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.saturationValueCanvas.nativeElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.sliderPosition.y = this.canvas.height * (1 - this.colorPickerService.value);
        this.sliderPosition.x = this.colorPickerService.saturation * this.canvas.width;

        this.hueChangedSubscription = this.colorPickerService.hueChanged$.subscribe((hue: number) => {
            this.draw();
        });
        this.saturationChangedSubscription = this.colorPickerService.saturationChanged$.subscribe((saturation: number) => {
            const color = this.colorPickerService.getColor();
            const isBlack = color.red === 0 && color.green === 0 && color.blue === 0;
            if (!this.isSliderPositionClipedToBottom || !isBlack) {
                this.sliderPosition.x = saturation * canvasWidth;
            }
            this.draw();
        });
        this.valueChangedSubscription = this.colorPickerService.valueChanged$.subscribe((value: number) => {
            this.sliderPosition.y = canvasHeight * (1 - value);
            this.draw();
        });

        this.draw();
    }

    ngOnDestroy(): void {
        this.hueChangedSubscription.unsubscribe();
        this.saturationChangedSubscription.unsubscribe();
        this.valueChangedSubscription.unsubscribe();
    }

    draw(): void {
        const color = Color.fromHsv(this.colorPickerService.hue, 1, 1);
        this.context.fillStyle = color.toRgbString();;
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
        circle.arc(this.sliderPosition.x, this.sliderPosition.y, radius, 0, 2 * Math.PI);
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
        }
        this.updateColor(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    @HostListener('document:mousemove', ['$event'])
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
        if (!this.isMouseDown) {
            return;
        }

        const mouseXPosition = event.clientX - this.saturationValueCanvas.nativeElement.getBoundingClientRect().x;
        this.sliderPosition.x = Math.min(canvasWidth, Math.max(0, mouseXPosition));

        const mouseYPosition = event.clientY - this.saturationValueCanvas.nativeElement.getBoundingClientRect().y;
        this.sliderPosition.y = Math.min(canvasHeight, Math.max(0, mouseYPosition));

        this.isSliderPositionClipedToBottom = mouseYPosition >= canvasHeight;

        this.colorPickerService.saturation = this.sliderPosition.x / canvasWidth;
        this.colorPickerService.value = 1.0 - this.sliderPosition.y / canvasHeight;
        this.draw();
    }
}
