import { TestBed } from '@angular/core/testing';
import { ThemeService } from '@app/theme/services/theme.service';

describe('ThemeService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ThemeService = TestBed.inject(ThemeService);
        expect(service).toBeTruthy();
    });
});
