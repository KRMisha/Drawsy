import { Command } from '@app/drawing/classes/commands/command';

export class RecolorCommand implements Command {
    constructor(
        private element: SVGGraphicsElement,
        private strokeBefore?: string,
        private fillBefore?: string,
        private strokeAfter?: string,
        private fillAfter?: string
    ) {}

    undo(): void {
        if (this.strokeBefore !== undefined) {
            this.element.setAttribute('stroke', this.strokeBefore);
        }
        if (this.fillBefore !== undefined) {
            this.element.setAttribute('fill', this.fillBefore);
        }
    }

    redo(): void {
        if (this.strokeAfter !== undefined) {
            this.element.setAttribute('stroke', this.strokeAfter);
        }
        if (this.fillAfter !== undefined) {
            this.element.setAttribute('fill', this.fillAfter);
        }
    }
}
