import { TestBed } from '@angular/core/testing';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';

describe('ToolEllipseService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolEllipseService = TestBed.inject(ToolEllipseService);
        expect(service).toBeTruthy();
    });
});
