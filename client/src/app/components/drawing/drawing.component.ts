import { Component, HostListener } from '@angular/core';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ToolService } from '../../services/tool/tool.service'

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent {
    constructor(public drawingService: DrawingService,
                private toolService: ToolService) {}

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.toolService.tool.onMouseMove(event);
        console.log('test');
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.toolService.tool.onMouseDown(event);
    }

    @HostListener('mouseUp', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.toolService.tool.onMouseUp(event);
    }

    @HostListener('keyPress', ['$event'])
    onKeyPress(event: KeyboardEvent) {
        this.toolService.tool.onKeyDown(event);
    }

    @HostListener('keyUp', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.toolService.tool.onMouseMove(event);
    }
}
