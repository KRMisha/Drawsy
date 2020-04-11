import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Command } from './command';

export class AppendElementsClipboardCommand implements Command {
    constructor(
        private clipboardService: ClipboardService,
        private drawingService: DrawingService,
        private elements: SVGGraphicsElement[],
        private offsetBefore: number,
        private offsetAfter: number
    ) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element);
        }
        // setTimeout(() => {
            this.clipboardService.placementPositionOffset = this.offsetBefore;
        // }, 0);
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element);
        }
        // setTimeout(() => {
            this.clipboardService.placementPositionOffset = this.offsetAfter;
        // }, 0);
    }
}
