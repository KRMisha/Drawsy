import { TestBed } from '@angular/core/testing';

import { GeometryService } from './geometry.service';

describe('GeometryService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GeometryService = TestBed.inject(GeometryService);
        expect(service).toBeTruthy();
    });
});
