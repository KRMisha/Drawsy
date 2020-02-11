import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../drawing.service';
import { StrokeTypes, ToolSetting } from '../tool';
import { ToolRectangleService } from './tool-rectangle.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-string-literal

class MockColor {
    toRgbaString(): string {
        return '';
    }
}

class MockSvgElement {
    getAttribute(): string {
        return '';
    }
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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a rectangle in drawing service on user click if mouse is inside canvas', () => {
        const drawingService = TestBed.get(DrawingService);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingService.addElement).toHaveBeenCalledTimes(1);
    });

    it('should not add a rectangle in drawing on user click if mouse is outside canvas', () => {
        const drawingService = TestBed.get(DrawingService);
        service.isMouseInside = false;

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingService.addElement).toHaveBeenCalledTimes(0);
    });

    it('should create a rectangle with stroke: none if user setting is FillOnly', () => {
        const drawingService = TestBed.get(DrawingService);
        spyOn(service.renderer, 'setAttribute');
        service.toolSettings.set(ToolSetting.StrokeType, StrokeTypes.FillOnly);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingService.addElement).toHaveBeenCalledTimes(1);
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'stroke', 'none');
    });

    it('should create a rectangle with fill: none if user setting is BorderOnly', () => {
        const drawingService = TestBed.get(DrawingService);
        spyOn(service.renderer, 'setAttribute');
        service.toolSettings.set(ToolSetting.StrokeType, StrokeTypes.BorderOnly);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        expect(drawingService.addElement).toHaveBeenCalledTimes(1);
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['rectangle'], 'fill', 'none');
    });

    it('should update rectangle automaticaly when pressing shift and releasing shift', () => {
        spyOn(service.renderer, 'setAttribute');

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
});
