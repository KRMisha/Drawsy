import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
// import { ToolSetting } from '@app/tools/enums/tool-settings.enum';

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
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: ({ addElement: (element: MockSvgElement) => {} } as unknown) as DrawingService },
                { provide: ColorService, useValue: new MockColorService() },
                { provide: Renderer2, useValue: renderer2SpyObj },
            ],
        });

        service = TestBed.get(ToolPaintbrushService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
