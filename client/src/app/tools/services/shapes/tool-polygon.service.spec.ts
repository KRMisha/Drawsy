import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';

import { ToolPolygonService } from './tool-polygon.service';

describe('ToolPolygonService', () => {
    let service: ToolPolygonService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', []);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpyObj }],
        });
        service = TestBed.inject(ToolPolygonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
