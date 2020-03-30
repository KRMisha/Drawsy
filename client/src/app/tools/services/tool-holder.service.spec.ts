import { TestBed } from '@angular/core/testing';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';

describe('ToolHolderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: ToolHolderService = TestBed.inject(ToolHolderService);
        expect(service).toBeTruthy();
    });
});
