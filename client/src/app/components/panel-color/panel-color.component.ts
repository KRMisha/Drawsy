import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { Color } from 'src/app/classes/color/color';

enum ColorString {
    OpaqueWhite = 'rgba(255, 255, 255, 1)',
    TransparentWhite = 'rgba(255, 255, 255, 0)',
    OpaqueBlack = 'rgba(0, 0, 0, 1)',
    TransparentBlack = 'rgba(0, 0, 0, 0)',
}

@Component({
    selector: 'app-panel-color',
    templateUrl: './panel-color.component.html',
    styleUrls: ['./panel-color.component.scss'],
})
export class PanelColorComponent implements AfterViewInit {
    @ViewChild('saturationValuePicker', { static: false }) saturationValueCanvas: ElementRef;


    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    @Input() hue = 0.0;
    private saturation = 0.0;
    private value = 1.0;

    private isMouseDown = false;
    private mouseX = 0;
    private mouseY = 0;

    private color = new Color(0, 0, 0);

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.saturationValueCanvas.nativeElement;
        this.canvas.width = 250;
        this.canvas.height = 160;
        this.draw();
    }

    draw(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const color = new Color(0, 0, 0);
        color.setHsv(this.hue, 1, 1);

        const colorStr = color.toString();
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

        this.color.setHsv(this.hue, this.saturation, this.value);

        const circle = new Path2D();
        circle.arc(this.mouseX, this.mouseY, 10, 0, 2 * Math.PI);
        this.context.fillStyle = this.color.toString();
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'rgb(255, 255, 255)';
        this.context.stroke(circle);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;
        this.updateColor(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.updateColor(event);
    }

    updateColor(event: MouseEvent): void {
        if (this.isMouseDown === false || event.pageY - this.canvas.offsetTop > this.canvas.height) {
            return;
        }

        this.saturation = event.offsetX / this.canvas.width;
        this.value = 1.0 - event.offsetY / this.canvas.height;
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        this.draw();
    }
}
