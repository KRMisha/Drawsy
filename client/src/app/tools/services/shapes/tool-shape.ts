import { RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { Color } from '@app/shared/classes/color';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolData } from '@app/tools/classes/tool-data';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { Tool } from '@app/tools/services/tool';

export abstract class ToolShape extends Tool {
    private shape?: SVGGraphicsElement;
    private isShiftDown = false;
    private origin: Vec2 = { x: 0, y: 0 };
    private isShapeAlwaysRegular: boolean;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        toolInfo: ToolData,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, commandService, toolInfo);
        this.isShapeAlwaysRegular = isShapeAlwaysRegular;
        this.settings.shapeType = ToolDefaults.defaultShapeType;
        this.settings.shapeBorderWidth = ToolDefaults.defaultShapeBorderWidth;
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
        if (Tool.isLeftMouseButtonDown) {
            this.updateShapeArea();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing) {
            this.shape = this.createNewShape();
            this.origin = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
            this.updateShapeArea();
            this.drawingService.addElement(this.shape);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left && this.shape !== undefined) {
            const isShapeRegular = this.isShiftDown || this.isShapeAlwaysRegular;
            const isValidRegular = isShapeRegular && (this.origin.x !== Tool.mousePosition.x || this.origin.y !== Tool.mousePosition.y);
            const isValidNonRegular = !isShapeRegular && this.origin.x !== Tool.mousePosition.x && this.origin.y !== Tool.mousePosition.y;
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

    protected abstract updateShape(shapeArea: Rect, scale: Vec2, shape: SVGGraphicsElement): void;

    private createNewShape(): SVGGraphicsElement {
        // tslint:disable: no-non-null-assertion
        const shape: SVGGraphicsElement = this.renderer.createElement(this.getShapeString(), 'svg');

        this.renderer.setAttribute(shape, 'stroke-width', this.settings.shapeBorderWidth!.toString());

        const fillValue = this.settings.shapeType! === ShapeType.BorderOnly ? 'none' : this.colorService.primaryColor.toRgbaString();
        this.renderer.setAttribute(shape, 'fill', fillValue);

        if (this.settings.shapeType! !== ShapeType.FillOnly) {
            this.renderer.setAttribute(shape, 'stroke', this.colorService.secondaryColor.toRgbaString());
        }

        this.renderer.setAttribute(shape, 'data-padding', `${this.settings.shapeBorderWidth! / 2}`);

        return shape;
        // tslint:enable: no-non-null-assertion
    }

    private updateShapeArea(): void {
        if (this.shape === undefined || !Tool.isLeftMouseButtonDown) {
            return;
        }

        const isCurrentMouseRightOfOrigin = Tool.mousePosition.x >= this.origin.x;
        const isCurrentMouseBelowOrigin = Tool.mousePosition.y >= this.origin.y;

        const mousePositionCopy = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        if (this.isShiftDown || this.isShapeAlwaysRegular) {
            const dimensions: Vec2 = {
                x: Math.abs(Tool.mousePosition.x - this.origin.x),
                y: Math.abs(Tool.mousePosition.y - this.origin.y),
            };
            const desiredSideSize = Math.max(dimensions.x, dimensions.y);
            mousePositionCopy.x = this.origin.x + (isCurrentMouseRightOfOrigin ? desiredSideSize : -desiredSideSize);
            mousePositionCopy.y = this.origin.y + (isCurrentMouseBelowOrigin ? desiredSideSize : -desiredSideSize);
        }

        const shapeArea = GeometryService.getRectFromPoints(this.origin, mousePositionCopy);
        const scale: Vec2 = { x: isCurrentMouseRightOfOrigin ? 1 : -1, y: isCurrentMouseBelowOrigin ? 1 : -1 };
        this.updateShape(shapeArea, scale, this.shape as SVGGraphicsElement);
    }
}
