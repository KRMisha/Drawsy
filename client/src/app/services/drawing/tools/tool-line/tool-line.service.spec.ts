import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from '../../drawing.service';
import { ToolSetting } from '../tool';
import { ToolLineService } from './tool-line.service';

// tslint:disable: no-empty
// tslint:disable: max-classes-per-file
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

describe('ToolLineService', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let service: ToolLineService;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj({
            addElement: (element: MockSvgElement) => {},
            removeElement: (element: MockSvgElement) => {},
            reappendStoredElements: () => {},
            clearStoredElements: () => {},
        });
        colorServiceSpyObj = jasmine.createSpyObj({
            getPrimaryColor: new MockColor(),
        });
        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });
        service = TestBed.get(ToolLineService);
        service.renderer = {
            setAttribute: (component: MockSvgElement, attributeName: string, attributeValue: string) => {},
            createElement: (a: string, b: string) => {
                return new MockSvgElement();
            },
        } as Renderer2;
    });

    it('should be created', () => {
        const toolLineService: ToolLineService = TestBed.get(ToolLineService);
        expect(toolLineService).toBeTruthy();
    });

    it('should place line points where user is clicking when mouse is inside', () => {
        const drawingService = TestBed.get(DrawingService);
        spyOn(service.renderer, 'setAttribute');

        service.isMouseInside = true;
        service.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10');

        service.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 20 20');

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 20, offsetY: 20 } as MouseEvent);

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 20 20');
        expect(drawingService.addElement).toHaveBeenCalled();
    });

    it('should not place line points where user is clicking when mouse is outside', () => {
        const drawingService = TestBed.get(DrawingService);
        spyOn(service.renderer, 'setAttribute');

        service.isMouseInside = false;
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 20, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledTimes(0);
        expect(drawingService.addElement).toHaveBeenCalledTimes(0);
    });

    it('Two points must be rendered when user makes a two segment line and junctions are enabled', () => {
        const drawingService = TestBed.get(DrawingService);
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        expect(service['junctionPoints'].length).toEqual(0);

        service.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['junctionPoints'][0], 'cx', '10');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['junctionPoints'][0], 'cy', '10');
        expect(service['junctionPoints'].length).toEqual(1);

        service.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 20 20');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['junctionPoints'][1], 'cx', '20');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['junctionPoints'][1], 'cy', '20');
        expect(service['junctionPoints'].length).toEqual(2);

        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 20, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 20 20');
        expect(drawingService.addElement).toHaveBeenCalled();
        expect(service['junctionPoints'].length).toEqual(0);
    });

    it('Line must follow x mouse position when in snap mode and angle is 0 degrees', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 50, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 50 10');
    });

    it('Line must follow x mouse position when in snap mode and angle is 180 degrees', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 20, offsetY: 40 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 40 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 20 50');
    });

    it('Line must follow x mouse position when in snap mode and angle is 45, 135, 225 or 315', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 110, offsetY: 100 } as MouseEvent);
        service.onMouseDown({ offsetX: 110, offsetY: 100 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 110 110');
    });

    it('Line must follow y mouse position when in snap mode and angle 90 or 270', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 55, offsetY: 100 } as MouseEvent);
        service.onMouseDown({ offsetX: 55, offsetY: 100 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 50 100');
    });

    it('Preview should update automatically when pressing and releasing shift', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onMouseMove({ offsetX: 55, offsetY: 100 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['previewLine'], 'x2', '55');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['previewLine'], 'y2', '100');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['previewLine'], 'x2', '50');
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['previewLine'], 'y2', '100');
    });

    it('Current line should be removed when pressing escape', () => {
        const drawingService = TestBed.get(DrawingService);
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);
        expect(drawingService.removeElement).toHaveBeenCalledWith(service['polyline']);
        expect(service['junctionPoints'].length).toEqual(0);
    });

    it('Nothing should happen if pressing escape with no current line being drawn', () => {
        const drawingService = TestBed.get(DrawingService);
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);

        expect(drawingService.removeElement).toHaveBeenCalledTimes(0);
    });

    it('Backspace should remove last point', () => {
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onMouseMove({ offsetX: 55, offsetY: 55 } as MouseEvent);
        service.onMouseDown({ offsetX: 55, offsetY: 55 } as MouseEvent);

        service.onMouseMove({ offsetX: 60, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 60, offsetY: 50 } as MouseEvent);

        expect(service['points'].length).toEqual(6);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(4);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(2);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(2);
    });

    it('Segment should close if double click is less than 3px away from original point', () => {
        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onMouseMove({ offsetX: 60, offsetY: 60 } as MouseEvent);
        service.onMouseDown({ offsetX: 60, offsetY: 60 } as MouseEvent);

        service.onMouseMove({ offsetX: 50, offsetY: 60 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 60 } as MouseEvent);

        service.onMouseMove({ offsetX: 51, offsetY: 49 } as MouseEvent);
        service.onMouseDown({ offsetX: 51, offsetY: 49 } as MouseEvent);
        service.onMouseDown({ offsetX: 51, offsetY: 49 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 51, offsetY: 49 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 60 60 50 60 50 50');
    });

    it('Junctions should be removed with the points of the line when the user presses backspace', () => {
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);
        service.isMouseInside = true;

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onMouseMove({ offsetX: 55, offsetY: 55 } as MouseEvent);
        service.onMouseDown({ offsetX: 55, offsetY: 55 } as MouseEvent);

        service.onMouseMove({ offsetX: 60, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 60, offsetY: 50 } as MouseEvent);

        expect(service['points'].length).toEqual(6);
        expect(service['junctionPoints'].length).toEqual(3);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(4);
        expect(service['junctionPoints'].length).toEqual(2);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(2);
        expect(service['junctionPoints'].length).toEqual(1);

        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);

        expect(service['points'].length).toEqual(2);
        expect(service['junctionPoints'].length).toEqual(1);
    });
});
