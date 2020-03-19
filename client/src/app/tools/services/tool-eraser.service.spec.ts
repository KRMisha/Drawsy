import { TestBed } from '@angular/core/testing';

import { ToolEraserService } from './tool-eraser.service';

describe('ToolEraserService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolEraserService = TestBed.inject(ToolEraserService);
        expect(service).toBeTruthy();
    });
});
