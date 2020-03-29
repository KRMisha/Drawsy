import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';

// tslint:disable: max-classes-per-file
// tslint:disable: no-string-literal

class ColorMock {
    toRgbaString = () => 'rgba(69, 69, 69, 1)';
}

describe('ToolPaintbrushService', () => {
    let service: ToolPaintbrushService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['createElement']);
        const drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement']);
        const colorServiceSpyObj = jasmine.createSpyObj('ColorService', {
            primaryColor: () => new ColorMock(),
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: Renderer2, useValue: renderer2SpyObj },
            ],
        });

        service = TestBed.inject(ToolPaintbrushService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
