import { TestBed } from '@angular/core/testing';

import { ColorPickerService } from './color-picker.service';

describe('ColorPickerServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ColorPickerService = TestBed.get(ColorPickerService);
        expect(service).toBeTruthy();
    });
});
