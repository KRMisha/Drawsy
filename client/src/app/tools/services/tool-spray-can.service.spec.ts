import { TestBed } from '@angular/core/testing';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';

describe('ToolSprayCanService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSprayCanService = TestBed.inject(ToolSprayCanService);
        expect(service).toBeTruthy();
    });
});
