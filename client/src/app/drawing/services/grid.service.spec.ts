import { TestBed } from '@angular/core/testing';
import { GridService } from '@app/drawing/services/grid.service';

describe('GridService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GridService = TestBed.inject(GridService);
        expect(service).toBeTruthy();
    });
});
