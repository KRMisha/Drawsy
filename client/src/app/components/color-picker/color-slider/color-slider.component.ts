import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, Input } from '@angular/core';
import { Color, MAX_HUE } from 'src/app/classes/color/color';

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
    hue = 0;

    @Input()
    set setHue(hue: number) {
        if (this.canvas !== undefined) {
            this.hue = hue;
            this.mouseX = hue / 360 * 250;
            this.draw();
        }
    }

    private isMouseDown = false;
    private mouseX = 0;

    private isMouseInside = false;

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
        horizontalGradient.addColorStop(0 / 6, 'rgb(255, 0, 0)');
        horizontalGradient.addColorStop(1 / 6, 'rgb(255, 255, 0)');
        horizontalGradient.addColorStop(2 / 6, 'rgb(0, 255, 0)');
        horizontalGradient.addColorStop(3 / 6, 'rgb(0, 255, 255)');
        horizontalGradient.addColorStop(4 / 6, 'rgb(0, 0, 255)');
        horizontalGradient.addColorStop(5 / 6, 'rgb(255, 0, 255)');
        horizontalGradient.addColorStop(6 / 6, 'rgb(255, 0, 0)');
        this.context.fillStyle = horizontalGradient;
        this.context.fillRect(0, 7, width, height - 14);

        const hueColor = new Color(0, 0, 0, 1);
        hueColor.setHsv(this.hue, 1.0, 1.0);

        const circle = new Path2D();
        circle.arc(this.mouseX, height / 2, 8, 0, 2 * Math.PI);
        this.context.fillStyle = hueColor.toRgbString();
        this.context.fill(circle);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.stroke(circle);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;
        this.update(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
        this.update(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.update(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.isMouseInside = false;
        this.isMouseDown = false;
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.isMouseInside = true;
    }

    update(event: MouseEvent): void {
        if (this.isMouseDown === false || this.isMouseInside === false) {
            return;
        }

        this.mouseX = event.offsetX;
        this.hue = (this.mouseX / this.canvas.width) * MAX_HUE;
        this.draw();
        this.hueChange.emit(this.hue);
    }
}
