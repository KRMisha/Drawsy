import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-panel-color',
    templateUrl: './panel-color.component.html',
    styleUrls: ['./panel-color.component.scss'],
})
export class PanelColorComponent implements AfterViewInit {

    @ViewChild('saturationValuePicker', {static: false}) saturationValueCanvas: ElementRef;
    private context: CanvasRenderingContext2D;

    constructor(){}

    ngAfterViewInit(): void {
        this.context = this.saturationValueCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.draw();
    }

    draw(): void {
        const width = 100;
        const height = 100;

        const bgColor = 'rgba(255, 0, 0, 1)';
        this.context.fillStyle = bgColor;
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
