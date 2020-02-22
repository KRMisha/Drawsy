import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from 'src/app/drawing/services/color.service';
import { DrawingService } from '../../../drawing/services/drawing.service';
import { StrokeTypes, ToolSetting } from '../tool';
import { ToolRectangleService } from './tool-rectangle.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

class MockColor {
    toRgbaString = () => 'rgba(76, 54, 32, 1)';
}

class MockSvgElement {
    getAttribute = () => '';
}

describe('ToolRectangleService', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let service: ToolRectangleService;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj({
            addElement: (element: MockSvgElement) => {},
        });
        colorServiceSpyObj = jasmine.createSpyObj({
            getPrimaryColor: new MockColor(),
            getSecondaryColor: new MockColor(),
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
            ],
        });
        service = TestBed.get(ToolRectangleService);
        service.renderer = {
            setAttribute: (component: MockSvgElement, attributeName: string, attributeValue: string) => {},
            createElement: (a: string, b: string) => {
                return new MockSvgElement();
            },
        } as Renderer2;

        service.isMouseInside = true;
        service.isMouseDown = false;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should add a rectangle in drawing service on user click if mouse is inside canvas', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        spyOn(service.renderer, 'createElement').and.callThrough();
        service.toolSettings.set(ToolSetting.Size, 42);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
        expect(service.renderer.createElement).toHaveBeenCalledWith('path', 'svg');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'stroke-width', '42');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'stroke-linecap', 'square');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'fill', 'rgba(76, 54, 32, 1)');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'stroke', 'rgba(76, 54, 32, 1)');
    });

    it('#onMouseDown should not add a rectangle in drawing on user click if mouse is outside canvas', () => {
        service.isMouseInside = false;

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#onMouseDown should create a rectangle with stroke: none if user setting is FillOnly', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service.toolSettings.set(ToolSetting.StrokeType, StrokeTypes.FillOnly);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'stroke', 'none');
    });

    it('#onMouseDown should create a rectangle with fill: none if user setting is BorderOnly', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service.toolSettings.set(ToolSetting.StrokeType, StrokeTypes.BorderOnly);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'fill', 'none');
    });

    it('should update rectangle automatically when pressing shift and releasing shift', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();

        service.onLeave({} as MouseEvent);
        service.onEnter({} as MouseEvent);

        service.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.isMouseDown = true;
        service.onMouseMove({ offsetX: 40, offsetY: 45 } as MouseEvent);

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'd', 'M20 20 H45 V45 H20 V20 ');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'd', 'M20 20 H40 V45 H20 V20 ');
    });

    it('#onKeyDown should do nothing if shift key is not pressed', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service['isSquare'] = false;
        service.onKeyDown({} as KeyboardEvent);

        expect(service['isSquare']).toEqual(false);
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();
    });

    it('#onKeyDown should only put isSquare to true if shift key is pressed and isMouseInside or isMouseDown is false', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service['isSquare'] = false;
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);

        expect(service['isSquare']).toEqual(true);
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();

        service.isMouseInside = false;
        service.isMouseDown = true;
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();
    });

    it('#onKeyDown should update the rectangle accordingly if the present x position is less than the origin x', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseDown({ offsetX: 40, offsetY: 40 } as MouseEvent);
        service.isMouseDown = true;
        service.onMouseMove({ offsetX: 20, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'd', 'M40 40 H20 V60 H40 V40 ');
    });

    it('#onKeyDown should update the rectangle accordingly if the present y position is less than the origin y', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseDown({ offsetX: 30, offsetY: 30 } as MouseEvent);
        service.isMouseDown = true;
        service.onMouseMove({ offsetX: 40, offsetY: 10 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'd', 'M30 30 H50 V10 H30 V30 ');
    });

    it('#onKeyUp should do nothing if shift key is released', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service['isSquare'] = true;
        service.onKeyUp({} as KeyboardEvent);

        expect(service['isSquare']).toEqual(true);
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();
    });

    it('#onKeyUp should only put isSquare to false if shift key is released and isMouseInside or isMouseDown is false', () => {
        spyOn(service.renderer, 'setAttribute').and.callThrough();
        service['isSquare'] = true;
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);

        expect(service['isSquare']).toEqual(false);
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();

        service.isMouseInside = false;
        service.isMouseDown = true;
        expect(service.renderer.setAttribute).not.toHaveBeenCalled();
    });

    it('#onEnter should set isMouseDown to false', () => {
        service.isMouseDown = true;
        service.onEnter({} as MouseEvent);
        expect(service.isMouseDown).toEqual(false);
    });

    it('#onLeave should set isMouseDown to false', () => {
        service.isMouseDown = true;
        service.onLeave({} as MouseEvent);
        expect(service.isMouseDown).toEqual(false);
    });
});
