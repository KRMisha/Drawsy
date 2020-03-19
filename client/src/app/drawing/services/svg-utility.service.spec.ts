import { TestBed } from '@angular/core/testing';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';

describe('SvgUtilityService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SvgUtilityService = TestBed.inject(SvgUtilityService);
        expect(service).toBeTruthy();
    });
});
