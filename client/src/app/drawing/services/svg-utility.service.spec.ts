import { TestBed } from '@angular/core/testing';

import { SvgUtilityService } from './svg-utility.service';

describe('SvgUtilityService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SvgUtilityService = TestBed.get(SvgUtilityService);
        expect(service).toBeTruthy();
    });
});