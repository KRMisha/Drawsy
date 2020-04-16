import { Command } from '@app/drawing/classes/commands/command';
import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { DrawingService } from '@app/drawing/services/drawing.service';

export class AddElementsClipboardCommand implements Command {
    constructor(
        private clipboardService: ClipboardService,
        private drawingService: DrawingService,
        private elements: SVGGraphicsElement[],
        private clipboardPositionOffsetBefore: number,
        private duplicationPositionOffsetBefore: number,
        private clipboardPositionOffsetAfter: number,
        private duplicationPositionOffsetAfter: number
    ) {}

    undo(): void {
        for (const element of this.elements) {
            this.drawingService.removeElement(element);
        }
        this.clipboardService.clipboardPositionOffset = this.clipboardPositionOffsetBefore;
        this.clipboardService.duplicationPositionOffset = this.duplicationPositionOffsetBefore;
    }

    redo(): void {
        for (const element of this.elements) {
            this.drawingService.addElement(element);
        }
        this.clipboardService.clipboardPositionOffset = this.clipboardPositionOffsetAfter;
        this.clipboardService.duplicationPositionOffset = this.duplicationPositionOffsetAfter;
    }
}
