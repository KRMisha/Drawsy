import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import ToolDefaults from '@app/tools/enums/tool-defaults';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolShape extends Tool {
    private shape?: SVGElement;
    private isShiftDown = false;
    private origin: Vec2 = { x: 0, y: 0 };
    private mousePosition: Vec2 = { x: 0, y: 0 };

    constructor(
        protected drawingService: DrawingService,
        protected colorService: ColorService,
        protected commandService: CommandService,
        name: ToolName,
    ) {
        super(drawingService, name);
        this.toolSettings.set(ToolSetting.StrokeSize, ToolDefaults.defaultStrokeSize);
        this.toolSettings.set(ToolSetting.StrokeType, ToolDefaults.defaultStrokeType);
    }

    protected abstract updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void;
    protected abstract createNewShape(): SVGElement;

    onPrimaryColorChange(color: Color): void {
        if (this.shape !== undefined) {
            this.renderer.setAttribute(this.shape, 'fill', color.toRgbaString());
        }
    }

    onSecondaryColorChange(color: Color): void {
        if (this.shape !== undefined) {
            this.renderer.setAttribute(this.shape, 'stroke', color.toRgbaString());
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (Tool.isMouseDown) {
            this.updateShapeArea();
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (Tool.isMouseInside) {
            this.shape = this.createNewShape();
            this.shape.setAttribute('shape-padding', ((this.toolSettings.get(ToolSetting.StrokeSize) as number) / 2).toString());
            this.origin = this.getMousePosition(event);
            this.updateShapeArea();
            this.drawingService.addElement(this.shape);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === ButtonId.Left && this.shape !== undefined) {
            this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.shape));
            this.shape = undefined;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = true;
            this.updateShapeArea();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftDown = false;
            this.updateShapeArea();
        }
    }

    private updateShapeArea(): void {
        if (this.shape === undefined || !Tool.isMouseDown) {
            return;
        }

        const mousePositionCopy = { x: this.mousePosition.x, y: this.mousePosition.y };
        const isCurrentMouseRightOfOrigin = mousePositionCopy.x >= this.origin.x;
        const isCurrentMouseBelowOrigin = mousePositionCopy.y >= this.origin.y;
        const scale: Vec2 = { x: isCurrentMouseRightOfOrigin ? 1 : -1, y: isCurrentMouseBelowOrigin ? 1 : -1 };

        if (this.isShiftDown) {
            const dimensions: Vec2 = { x: Math.abs(mousePositionCopy.x - this.origin.x), y: Math.abs(mousePositionCopy.y - this.origin.y) };
            const desiredSideSize = Math.max(dimensions.x, dimensions.y);
            const deltaDimensions: Vec2 = { x: Math.abs(dimensions.x - desiredSideSize), y: Math.abs(dimensions.y - desiredSideSize) };

            mousePositionCopy.x += isCurrentMouseRightOfOrigin ? deltaDimensions.x : -deltaDimensions.x;
            mousePositionCopy.y += isCurrentMouseBelowOrigin ? deltaDimensions.y : -deltaDimensions.y;
        }

        const shapeArea = GeometryService.getRectFromPoints(this.origin, mousePositionCopy);
        this.updateShape(shapeArea, scale, this.shape as SVGElement);
    }
}
