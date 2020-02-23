import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '../../../../drawing/services/drawing.service';
import { ToolSetting } from '../../tool';
import { ToolPaintbrushService } from './tool-paintbrush.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-string-literal

class MockColor {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

class MockColorService {
    getPrimaryColor = () => new MockColor();
}

class MockSvgElement {
    getAttribute = () => '';
}

describe('ToolPaintbrushService', () => {
    let service: ToolPaintbrushService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: ({ addElement: (element: MockSvgElement) => {} } as unknown) as DrawingService },
                { provide: ColorService, useValue: new MockColorService() },
            ],
        });

        service = TestBed.get(ToolPaintbrushService);
        service.renderer = {
            setAttribute: (element: MockSvgElement, name: string, value: string) => {},
            createElement: (name: string, namespace?: string) => new MockSvgElement(),
        } as Renderer2;
        spyOn(service.renderer, 'setAttribute').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should create a new path with filter if mouse is in bounds', () => {
        service.isMouseInside = true;
        service.onMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
        expect(service.renderer.setAttribute).toHaveBeenCalledWith(
            service['path'],
            'filter',
            'url(#texture' + service.toolSettings.get(ToolSetting.Texture) + ')',
        );
    });
});
