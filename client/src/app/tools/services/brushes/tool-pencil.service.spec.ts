import { TestBed } from '@angular/core/testing';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';

describe('ToolPencilService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolPencilService = TestBed.inject(ToolPencilService);
        expect(service).toBeTruthy();
    });
});
