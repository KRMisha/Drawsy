import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
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
    @ViewChild('appSaturationValuePicker') saturationValueCanvas: ElementRef<HTMLCanvasElement>;

    private context: CanvasRenderingContext2D;

    private isLeftMouseButtonDown = false;
    private isMouseInside = false;
    private sliderPosition: Vec2 = { x: 0, y: canvasHeight };

    private hueChangedSubscription: Subscription;
    private saturationChangedSubscription: Subscription;
    private valueChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        const canvas = this.saturationValueCanvas.nativeElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.hueChangedSubscription = this.colorPickerService.hueChanged$.subscribe((hue: number) => {
            this.draw();
        });
        this.saturationChangedSubscription = this.colorPickerService.saturationChanged$.subscribe((saturation: number) => {
            this.sliderPosition.x = saturation * canvasWidth;
            this.draw();
        });
        this.valueChangedSubscription = this.colorPickerService.valueChanged$.subscribe((value: number) => {
            this.sliderPosition.y = (1 - value) * canvasHeight;
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.hueChangedSubscription.unsubscribe();
        this.saturationChangedSubscription.unsubscribe();
        this.valueChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseButtonDown) {
            this.updateColor(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside && event.button === MouseButton.Left) {
            this.isLeftMouseButtonDown = true;
            this.updateColor(event);
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
        this.onMouseMove(TouchService.mockMouseEventFromTouchEvent(event));
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        this.onMouseEnter();
        this.onMouseDown(TouchService.mockMouseEventFromTouchEvent(event));
    }

    @HostListener('document:touchend', ['$event'])
    onTouchEnd(event: TouchEvent): void {
        this.onMouseUp(TouchService.mockMouseEventFromTouchEvent(event));
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

    private updateColor(event: MouseEvent): void {
        const mouseXPosition = event.clientX - this.saturationValueCanvas.nativeElement.getBoundingClientRect().x;
        const mouseYPosition = event.clientY - this.saturationValueCanvas.nativeElement.getBoundingClientRect().y;

        this.colorPickerService.saturation = Math.min(canvasWidth, Math.max(0, mouseXPosition)) / canvasWidth;
        this.colorPickerService.value = 1.0 - Math.min(canvasHeight, Math.max(0, mouseYPosition)) / canvasHeight;
    }

    private draw(): void {
        this.context.fillStyle = Color.fromHsv(this.colorPickerService.hue, 1, 1).toRgbString();
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

        const radius = 10;
        const circle = new Path2D();
        circle.arc(this.sliderPosition.x, this.sliderPosition.y, radius, 0, 2 * Math.PI);

        this.context.fillStyle = this.colorPickerService.getColor().toRgbString();
        this.context.fill(circle);

        const lineWidth = 2;
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }
}
