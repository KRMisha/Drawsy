import { RendererFactory2 } from '@angular/core';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { ToolShape } from '@app/tools/services/shapes/tool-shape';

class ToolShapeMock extends ToolShape {
    constructor(
        rendererFactory: RendererFactory2,
        drawingService: DrawingService,
        colorService: ColorService,
        commandService: CommandService,
        name: ToolName,
        isShapeAlwaysRegular: boolean
    ) {
        super(rendererFactory, drawingService, colorService, commandService, name, isShapeAlwaysRegular);
    }
    getShapeString(): string {
        return '';
    }
    updateShape(shapeArea: Rect, scale: Vec2, shape: SVGElement): void {
        return;
    }
}

fdescribe('ToolShape', () => {
    const name: ToolName = ToolName.Brush;
    const isShapeAlwaysRegular = true;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    let toolShape: ToolShapeMock;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [
            'addElement',
            'removeElement'
        ]);
        commandServiceSpyObj = jasmine.createSpyObj('CommandService', [
            'addCommand'
        ]);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', [
            'createRenderer'
        ]);
        const renderer2SpyObj = jasmine.createSpyObj('Renderer2', [
            'setAttribute',
            'createElement'
        ]);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        const colorServiceStub = {} as ColorService;
        toolShape = new ToolShapeMock(
            rendererFactory2SpyObj,
            drawingServiceSpyObj,
            colorServiceStub,
            commandServiceSpyObj,
            name,
            isShapeAlwaysRegular
        );
    });

    it('should create an instance', () => {
        expect(toolShape).toBeTruthy();
    });
});
