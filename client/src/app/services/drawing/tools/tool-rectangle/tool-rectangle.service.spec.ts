import { TestBed } from '@angular/core/testing';

import { ToolRectangleService } from './tool-rectangle.service';

describe('ToolRectangleService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolRectangleService = TestBed.get(ToolRectangleService);
        expect(service).toBeTruthy();
    });
});
