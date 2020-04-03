import { TestBed } from '@angular/core/testing';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
