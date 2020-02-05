import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Color } from 'src/app/classes/color/color';

@Component({
    selector: 'app-panel-color',
    templateUrl: './panel-color.component.html',
    styleUrls: ['./panel-color.component.scss'],
})
export class PanelColorComponent implements AfterViewInit {
    @ViewChild('saturationValuePicker', { static: false }) saturationValueCanvas: ElementRef;

    private context: CanvasRenderingContext2D;
    @Input() hue = 0;

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.draw();
    }

    draw(): void {
        const canvas = this.saturationValueCanvas.nativeElement;
        const width = canvas.width;
        const height = canvas.height;

        const color = new Color(0, 0, 0, 1);
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
    }
}
