import { TestBed } from '@angular/core/testing';

import { ToolEyedropperService } from './tool-eyedropper.service';

describe('ToolEyedropperService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolEyedropperService = TestBed.inject(ToolEyedropperService);
        expect(service).toBeTruthy();
    });
});
