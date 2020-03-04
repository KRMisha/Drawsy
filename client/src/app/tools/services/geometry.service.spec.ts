import { TestBed } from '@angular/core/testing';

import { GeometryService } from '../../drawing/services/geometry.service';

describe('GeometryService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GeometryService = TestBed.get(GeometryService);
        expect(service).toBeTruthy();
    });
});
