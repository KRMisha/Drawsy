import { Color } from '@app/classes/color';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GeometryService } from '@app/drawing/services/geometry.service';
import { Tool } from '@app/tools/services/tool';
import { StrokeTypes, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { ToolDefaults } from '@app/tools/enums/tool-defaults.enum';

export class Shape extends Tool {
    private shape: SVGElement;
    private isShiftDown = false;
    private origin: Vec2 = { x: 0, y: 0 };
    private mousePosition: Vec2 = { x: 0, y: 0 };

    constructor(drawingService: DrawingService, private colorService: ColorService, name: string) {
        super(drawingService, name);
        this.toolSettings.set(ToolSetting.Size, ToolDefaults.Size);
        this.toolSettings.set(ToolSetting.StrokeType, ToolDefaults.StrokeType);
    }

    protected updateShape(shapeArea: Rect, shape: SVGElement): void {} // tslint:disable-line: no-empty

    protected createNewShape(): SVGElement {
        return {} as SVGElement;
    }

    onPrimaryColorChange(color: Color): void {
        if (this.isMouseInside && this.isMouseDown) {
            this.renderer.setAttribute(this.shape, 'fill', color.toRgbaString());
        }
    }

    onSecondaryColorChange(color: Color): void {
        if (this.isMouseInside && this.isMouseDown) {
            this.renderer.setAttribute(this.shape, 'stroke', color.toRgbaString());
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (this.isMouseInside && this.isMouseDown) {
            this.updateShapeArea();
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
        if (this.isMouseInside) {
            this.shape = this.createNewShape();
            this.setElementAttributes(this.shape);
            this.origin = this.getMousePosition(event);
            this.updateShapeArea();
            this.drawingService.addElement(this.shape);
        }
    }

    onEnter(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onLeave(event: MouseEvent): void {
        this.isMouseDown = false;
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
        if (this.shape === undefined || !this.isMouseDown) {
            return;
        }

        const mousePositionCopy = { x: this.mousePosition.x, y: this.mousePosition.y };
        if (this.isShiftDown) {
            const width = Math.abs(mousePositionCopy.x - this.origin.x);
            const height = Math.abs(mousePositionCopy.y - this.origin.y);
            const desiredSideSize = Math.max(width, height);

            const deltaWidth = Math.abs(width - desiredSideSize);
            const deltaHeight = Math.abs(height - desiredSideSize);

            if (mousePositionCopy.x >= this.origin.x) {
                mousePositionCopy.x += deltaWidth;
            } else {
                mousePositionCopy.x -= deltaWidth;
            }

            if (mousePositionCopy.y >= this.origin.y) {
                mousePositionCopy.y += deltaHeight;
            } else {
                mousePositionCopy.y -= deltaHeight;
            }
        }
        const shapeArea = GeometryService.getRectFromPoints(this.origin, mousePositionCopy);
        this.updateShape(shapeArea, this.shape);
    }

    private setElementAttributes(element: SVGElement): void {
        this.renderer.setAttribute(element, 'stroke-width', (this.toolSettings.get(ToolSetting.Size) as number).toString());
        this.renderer.setAttribute(element, 'stroke-linecap', 'square');
        this.renderer.setAttribute(element, 'fill', this.colorService.getPrimaryColor().toRgbaString());
        this.renderer.setAttribute(element, 'stroke', this.colorService.getSecondaryColor().toRgbaString());

        if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeTypes.FillOnly) {
            this.renderer.setAttribute(element, 'stroke', 'none');
        } else if (this.toolSettings.get(ToolSetting.StrokeType) === StrokeTypes.BorderOnly) {
            this.renderer.setAttribute(element, 'fill', 'none');
        }
    }
}
