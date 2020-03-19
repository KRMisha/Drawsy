import { TestBed } from '@angular/core/testing';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';

describe('ToolSelectionService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSelectionService = TestBed.inject(ToolSelectionService);
        expect(service).toBeTruthy();
    });
});
