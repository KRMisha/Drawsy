import { Renderer2 } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../../drawing.service';
import { ToolSetting } from '../../tool';
import { ToolBrush } from './tool-brush';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-string-literal

class MockToolBrush extends ToolBrush {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.toolSettings.set(ToolSetting.Size, 42);
    }
}

class MockColor {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

class MockSvgElement {
    getAttribute = () => '';
}

describe('ToolBrush', () => {
    let toolBrush: MockToolBrush;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj({
            addElement: (element: MockSvgElement) => {},
        });
        const colorServiceSpyObj = jasmine.createSpyObj({
            getPrimaryColor: new MockColor(),
        });
        toolBrush = new MockToolBrush(drawingServiceSpyObj, colorServiceSpyObj);
        toolBrush.renderer = {
            setAttribute: (element: MockSvgElement, name: string, value: string) => {},
            createElement: (name: string, namespace?: string) => new MockSvgElement(),
        } as Renderer2;

        spyOn(toolBrush.renderer, 'setAttribute').and.callThrough();
        spyOn(toolBrush.renderer, 'createElement').and.callThrough();
    });

    it('should be created', () => {
        expect(toolBrush).toBeTruthy();
    });

    it('#onMouseMove should set a path if mouse is down and in bounds', () => {
        toolBrush['path'] = (new MockSvgElement() as unknown) as SVGPathElement;
        toolBrush.isMouseDown = true;
        toolBrush.isMouseInside = true;

        toolBrush.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);

        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'd', 'L10 10 ');
    });

    it('#onMouseMove should not set a path if mouse is not down or if it is not in bounds', () => {
        toolBrush.isMouseDown = true;
        toolBrush.isMouseInside = false;
        toolBrush.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(toolBrush.renderer.setAttribute).not.toHaveBeenCalled();

        toolBrush.isMouseDown = false;
        toolBrush.isMouseInside = true;
        toolBrush.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(toolBrush.renderer.setAttribute).not.toHaveBeenCalled();
    });

    it('#onMouseDown should create a new path if mouse is in bounds', () => {
        toolBrush.isMouseInside = true;
        toolBrush.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(toolBrush.renderer.createElement).toHaveBeenCalledWith('path', 'svg');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'd', 'M10 10 L10 10 ');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'fill', 'none');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'stroke', 'rgba(69, 69, 69, 1)');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'stroke-width', '42');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'stroke-linecap', 'round');
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'stroke-linejoin', 'round');
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledWith(toolBrush['path']);
    });

    it('#onMouseDown should not create a new path if mouse is out of bounds', () => {
        toolBrush.isMouseInside = false;
        toolBrush.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(toolBrush.renderer.createElement).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#onEnter should set isMouseInside to false', () => {
        toolBrush.onEnter({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(toolBrush.isMouseInside).toEqual(false);
    });

    it('#onLeave should set a path and isMouseDown to false if mouse click is held', () => {
        toolBrush['path'] = (new MockSvgElement() as unknown) as SVGPathElement;
        toolBrush.isMouseDown = true;
        toolBrush.onLeave({ offsetX: 1337, offsetY: 1337 } as MouseEvent);
        expect(toolBrush.renderer.setAttribute).toHaveBeenCalledWith(toolBrush['path'], 'd', 'L1337 1337 ');
    });

    it('#onLeave should not set a path if mouse is not down', () => {
        toolBrush.isMouseDown = false;
        toolBrush.onLeave({ offsetX: 0, offsetY: 0 } as MouseEvent);
        expect(toolBrush.renderer.setAttribute).not.toHaveBeenCalled();
    });
});
