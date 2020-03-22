import { RendererFactory2 } from '@angular/core';
import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolShape extends Tool {
    private shape?: SVGElement;
    private isShiftDown = false;
    private origin: Vec2 = { x: 0, y: 0 };
    private mousePosition: Vec2 = { x: 0, y: 0 };
    private isShapeAlwaysRegular: boolean;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        name: ToolName,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, commandService, name);
        this.isShapeAlwaysRegular = isShapeAlwaysRegular;
        this.toolSettings.set(ToolSetting.ShapeType, ToolDefaults.defaultShapeType);
        this.toolSettings.set(ToolSetting.ShapeBorderWidth, ToolDefaults.defaultShapeBorderWidth);
    }

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
        if (Tool.isMouseInsideDrawing) {
            this.shape = this.createNewShape();
            this.origin = this.getMousePosition(event);
            this.updateShapeArea();
            this.drawingService.addElement(this.shape);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === ButtonId.Left && this.shape !== undefined) {
            const isShapeRegular = this.isShiftDown || this.isShapeAlwaysRegular;
            const isValidRegular = isShapeRegular && (this.origin.x !== this.mousePosition.x || this.origin.y !== this.mousePosition.y);
            const isValidNonRegular = !isShapeRegular && this.origin.x !== this.mousePosition.x && this.origin.y !== this.mousePosition.y;
            if (isValidRegular || isValidNonRegular) {
                this.commandService.addCommand(new AppendElementCommand(this.drawingService, this.shape));
            } else {
                this.drawingService.removeElement(this.shape);
            }
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

    protected abstract getShapeString(): string;

    protected abstract updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void;

    private createNewShape(): SVGElement {
        const shape: SVGElement = this.renderer.createElement(this.getShapeString(), 'svg');

        this.renderer.setAttribute(shape, 'stroke-width', (this.toolSettings.get(ToolSetting.ShapeBorderWidth) as number).toString());

        const fillValue =
            this.toolSettings.get(ToolSetting.ShapeType) === ShapeType.BorderOnly
                ? 'none'
                : this.colorService.getPrimaryColor().toRgbaString();
        this.renderer.setAttribute(shape, 'fill', fillValue);

        if (this.toolSettings.get(ToolSetting.ShapeType) !== ShapeType.FillOnly) {
            this.renderer.setAttribute(shape, 'stroke', this.colorService.getSecondaryColor().toRgbaString());
        }

        this.renderer.setAttribute(shape, 'padding', `${(this.toolSettings.get(ToolSetting.ShapeBorderWidth) as number) / 2}`);

        return shape;
    }

    private updateShapeArea(): void {
        if (this.shape === undefined || !Tool.isMouseDown) {
            return;
        }

        const isCurrentMouseRightOfOrigin = this.mousePosition.x >= this.origin.x;
        const isCurrentMouseBelowOrigin = this.mousePosition.y >= this.origin.y;
        const scale: Vec2 = { x: isCurrentMouseRightOfOrigin ? 1 : -1, y: isCurrentMouseBelowOrigin ? 1 : -1 };

        const mousePositionCopy = { x: this.mousePosition.x, y: this.mousePosition.y };
        if (this.isShiftDown || this.isShapeAlwaysRegular) {
            const dimensions: Vec2 = {
                x: Math.abs(this.mousePosition.x - this.origin.x),
                y: Math.abs(this.mousePosition.y - this.origin.y),
            };
            const desiredSideSize = Math.max(dimensions.x, dimensions.y);

            mousePositionCopy.x = this.origin.x + (isCurrentMouseRightOfOrigin ? desiredSideSize : -desiredSideSize);
            mousePositionCopy.y = this.origin.y + (isCurrentMouseBelowOrigin ? desiredSideSize : -desiredSideSize);
        }

        const shapeArea = GeometryService.getRectFromPoints(this.origin, mousePositionCopy);
        this.updateShape(shapeArea, scale, this.shape as SVGElement);
    }
}
