import { Color } from '@app/classes/color';
import { Command } from '@app/drawing/classes/commands/command';

export class ChangeColorCommand implements Command {
    constructor(private element: SVGElement, private colorAttribute: string, private oldColor: Color, private newColor: Color) {}

    undo(): void {
        this.element.setAttribute(this.colorAttribute, this.oldColor.toRgbaString());
    }

    redo(): void {
        this.element.setAttribute(this.colorAttribute, this.newColor.toRgbaString());
    }
}
