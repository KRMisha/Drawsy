import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { Color } from 'src/app/classes/color/color';
import { MatHint } from '@angular/material/form-field';

@Component({
    selector: 'app-panel-color',
    templateUrl: './panel-color.component.html',
    styleUrls: ['./panel-color.component.scss'],
})
export class PanelColorComponent implements AfterViewInit {
    @ViewChild('saturationValuePicker', { static: false }) saturationValueCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    @Input() hue = 0;

    private isMouseDown = false;

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas = this.saturationValueCanvas.nativeElement;
        this.draw();
    }

    draw(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const color = new Color(0, 0, 0);
        color.setHsv(this.hue, 1, 1);
        const colorStr = color.toString();
        console.log(colorStr);

        this.context.fillStyle = colorStr;
        this.context.fillRect(0, 0, width, height);

        const horizontalGradient = this.context.createLinearGradient(0, 0, width, 0);
        horizontalGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        horizontalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 0, width, height);

        const verticalGradient = this.context.createLinearGradient(0, 0, 0, height);
        verticalGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        verticalGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.context.fillStyle = verticalGradient;
        this.context.fillRect(0, 0, width, height);

        let circle = new Path2D();
        // circle.moveTo(125, 125);
        circle.arc(20, 20, 10, 0, 2 * Math.PI);
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
        if (this.isMouseDown === false) {
            return;
        }
        const saturation = event.offsetX / this.canvas.width;
        const value = event.offsetY / this.canvas.height;

        let color = new Color(0, 0, 0);
        color.setHsv(this.hue, value, saturation);

        console.log(`r: ${color.red} g: ${color.green} b: ${color.blue}`);
    }
}
