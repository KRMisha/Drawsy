import { TestBed } from '@angular/core/testing';

import { SvgUtilitiesService } from './svg-utilities.service';

describe('SvgUtilitiesService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SvgUtilitiesService = TestBed.get(SvgUtilitiesService);
        expect(service).toBeTruthy();
    });
});
