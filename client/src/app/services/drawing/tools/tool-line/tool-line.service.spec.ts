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

        spyOn(service.renderer, 'setAttribute');
        service.isMouseInside = true;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should place line points where user is clicking when mouse is inside', () => {
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
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it('should not place line points where user is clicking when mouse is outside', () => {
        service.isMouseInside = false;
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 20 } as MouseEvent);
        service.onMouseDoubleClick({ offsetX: 20, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledTimes(0);
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalledTimes(0);
    });

    it('should render two point when user makes a two segment line and junctions are enabled', () => {
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

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
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
        expect(service['junctionPoints'].length).toEqual(0);
    });

    it('should make line follow x mouse position when in snap mode while angle is 0', () => {
        service.onMouseMove({ offsetX: 10, offsetY: 10 } as MouseEvent);
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 50, offsetY: 20 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 20 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '10 10 50 10');
    });

    it('should make line follow x mouse position when in snap mode while angle is 180', () => {
        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 20, offsetY: 40 } as MouseEvent);
        service.onMouseDown({ offsetX: 20, offsetY: 40 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 20 50');
    });

    it('should make line follow x mouse position when in snap mode while angle is 45, 135, 225 or 315', () => {
        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 110, offsetY: 100 } as MouseEvent);
        service.onMouseDown({ offsetX: 110, offsetY: 100 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 110 110');
    });

    it('should make line follow y mouse position when in snap mode while angle is 90 of 270', () => {
        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50');

        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        service.onMouseMove({ offsetX: 55, offsetY: 100 } as MouseEvent);
        service.onMouseDown({ offsetX: 55, offsetY: 100 } as MouseEvent);

        expect(service.renderer.setAttribute).toHaveBeenCalledWith(service['polyline'], 'points', '50 50 50 100');
    });

    it('should update preview automatically when pressing and releasing shift', () => {
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

    it('should remove current line when pressing escape', () => {
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onMouseDown({ offsetX: 50, offsetY: 50 } as MouseEvent);

        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledWith(service['polyline']);
        expect(service['junctionPoints'].length).toEqual(0);
    });

    it('should do nothing if pressing escape when no current line is being drawn', () => {
        service.onMouseMove({ offsetX: 50, offsetY: 50 } as MouseEvent);
        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);

        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalledTimes(0);
    });

    it('should remove last point when backspace is hit', () => {
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

    it('should make segment loop on itself if double click is less than 3px away from original point', () => {
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

    it('should remove the line junctions when the user presses backspace', () => {
        service.toolSettings.set(ToolSetting.HasJunction, [true, 5]);

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
