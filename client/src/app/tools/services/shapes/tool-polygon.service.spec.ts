import { TestBed } from '@angular/core/testing';

import { ToolPolygonService } from './tool-polygon.service';

describe('ToolPolygonService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolPolygonService = TestBed.get(ToolPolygonService);
        expect(service).toBeTruthy();
    });
});
