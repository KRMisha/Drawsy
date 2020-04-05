import { RendererFactory2 } from '@angular/core';
import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
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
    private isShapeAlwaysRegular: boolean;
    private shapeOrigin: Vec2 = { x: 0, y: 0 };
    private isShiftDown = false;

    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        historyService: HistoryService,
        toolInfo: ToolData,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, historyService, toolInfo);
        this.isShapeAlwaysRegular = isShapeAlwaysRegular;
        this.settings.shapeType = ToolDefaults.defaultShapeType;
        this.settings.shapeBorderWidth = ToolDefaults.defaultShapeBorderWidth;
    }

    onMouseMove(): void {
        this.updateShapeArea();
    }

    onMouseDown(event: MouseEvent): void {
        if (Tool.isMouseInsideDrawing && event.button === MouseButton.Left) {
            this.shape = this.createShape();
            this.shapeOrigin = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
            this.updateShapeArea();
            this.drawingService.addElement(this.shape);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.stopDrawing();
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

    protected abstract getShapeString(): string;

    protected abstract updateShape(shapeArea: Rect, scale: Vec2, shape: SVGGraphicsElement): void;

    private createShape(): SVGGraphicsElement {
        const shape: SVGGraphicsElement = this.renderer.createElement(this.getShapeString(), 'svg');

        // tslint:disable: no-non-null-assertion
        const fillValue = this.settings.shapeType! === ShapeType.BorderOnly ? 'none' : this.colorService.primaryColor.toRgbaString();
        this.renderer.setAttribute(shape, 'fill', fillValue);
        if (this.settings.shapeType! !== ShapeType.FillOnly) {
            this.renderer.setAttribute(shape, 'stroke', this.colorService.secondaryColor.toRgbaString());
        }
        this.renderer.setAttribute(shape, 'stroke-width', this.settings.shapeBorderWidth!.toString());
        this.renderer.setAttribute(shape, 'data-padding', `${this.settings.shapeBorderWidth! / 2}`);
        // tslint:enable: no-non-null-assertion

        return shape;
    }

    private updateShapeArea(): void {
        if (this.shape === undefined || !Tool.isLeftMouseButtonDown) {
            return;
        }

        const isCurrentMouseRightOfOrigin = Tool.mousePosition.x >= this.shapeOrigin.x;
        const isCurrentMouseBelowOrigin = Tool.mousePosition.y >= this.shapeOrigin.y;

        const mousePositionCopy = { x: Tool.mousePosition.x, y: Tool.mousePosition.y };
        if (this.isShiftDown || this.isShapeAlwaysRegular) {
            const dimensions: Vec2 = {
                x: Math.abs(Tool.mousePosition.x - this.shapeOrigin.x),
                y: Math.abs(Tool.mousePosition.y - this.shapeOrigin.y),
            };
            const desiredSideSize = Math.max(dimensions.x, dimensions.y);
            mousePositionCopy.x = this.shapeOrigin.x + (isCurrentMouseRightOfOrigin ? desiredSideSize : -desiredSideSize);
            mousePositionCopy.y = this.shapeOrigin.y + (isCurrentMouseBelowOrigin ? desiredSideSize : -desiredSideSize);
        }

        const shapeArea = Rect.fromPoints(this.shapeOrigin, mousePositionCopy);
        const scale: Vec2 = { x: isCurrentMouseRightOfOrigin ? 1 : -1, y: isCurrentMouseBelowOrigin ? 1 : -1 };
        this.updateShape(shapeArea, scale, this.shape);
    }

    private stopDrawing(): void {
        if (this.shape === undefined) {
            return;
        }

        const isShapeRegular = this.isShiftDown || this.isShapeAlwaysRegular;
        const isValidRegular =
            isShapeRegular && (this.shapeOrigin.x !== Tool.mousePosition.x || this.shapeOrigin.y !== Tool.mousePosition.y);
        const isValidNonRegular =
            !isShapeRegular && this.shapeOrigin.x !== Tool.mousePosition.x && this.shapeOrigin.y !== Tool.mousePosition.y;
        if (isValidRegular || isValidNonRegular) {
            this.historyService.addCommand(new AppendElementCommand(this.drawingService, this.shape));
        } else {
            this.drawingService.removeElement(this.shape);
        }
        this.shape = undefined;
    }
}
