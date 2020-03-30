import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Subscription } from 'rxjs';

const canvasWidth = 200;
const canvasHeight = 20;

@Component({
    selector: 'app-hue-slider',
    templateUrl: './hue-slider.component.html',
    styleUrls: ['./hue-slider.component.scss'],
})
export class HueSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('appHuePicker') hueCanvas: ElementRef<HTMLCanvasElement>;

    private context: CanvasRenderingContext2D;

    private isLeftMouseButtonDown = false;
    private isMouseInside = false;
    private sliderPosition = 0;

    private hueChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        const canvas = this.hueCanvas.nativeElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.hueChangedSubscription = this.colorPickerService.hueChanged$.subscribe((hue: number) => {
            this.sliderPosition = (hue / Color.maxHue) * canvasWidth;
            this.draw();
        });
    }

    ngOnDestroy(): void {
        this.hueChangedSubscription.unsubscribe();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseButtonDown) {
            this.updateHue(event);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInside) {
            this.isLeftMouseButtonDown = true;
            this.updateHue(event);
        }
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

    private updateHue(event: MouseEvent): void {
        const mouseXPosition = event.clientX - this.hueCanvas.nativeElement.getBoundingClientRect().x;
        const hue = (Math.min(canvasWidth, Math.max(0, mouseXPosition)) / canvasWidth) * Color.maxHue;
        this.colorPickerService.hue = hue;
    }

    private draw(): void {
        const colorGradient = [
            'rgb(255, 0, 0)',
            'rgb(255, 255, 0)',
            'rgb(0, 255, 0)',
            'rgb(0, 255, 255)',
            'rgb(0, 0, 255)',
            'rgb(255, 0, 255)',
        ];

        const horizontalGradient = this.context.createLinearGradient(0, 0, canvasWidth, 0);
        for (let i = 0; i < colorGradient.length; i++) {
            horizontalGradient.addColorStop(i / colorGradient.length, colorGradient[i]);
        }
        horizontalGradient.addColorStop(1, colorGradient[0]);
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const radius = 8;
        const circle = new Path2D();
        circle.arc(this.sliderPosition, canvasHeight / 2, radius, 0, 2 * Math.PI);

        const hueColor = Color.fromHsv(this.colorPickerService.hue, 1.0, 1.0);
        this.context.fillStyle = hueColor.toRgbString();
        this.context.fill(circle);

        const lineWidth = 2;
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }
}
