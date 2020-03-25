import { TestBed } from '@angular/core/testing';

import { ColorPickerService } from '@app/color-picker/services/color-picker.service';

describe('ColorPickerServiceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: ColorPickerService},
            ],
        });
    });

    it('should be created', () => {
        const service: ColorPickerService = TestBed.inject(ColorPickerService);
        expect(service).toBeTruthy();
    });
});
