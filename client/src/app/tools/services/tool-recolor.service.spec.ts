import { TestBed } from '@angular/core/testing';

import { ToolRecolorService } from './tool-recolor.service';

describe('ToolRecolorService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolRecolorService = TestBed.get(ToolRecolorService);
        expect(service).toBeTruthy();
    });
});
