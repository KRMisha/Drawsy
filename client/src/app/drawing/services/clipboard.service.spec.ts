import { TestBed } from '@angular/core/testing';

import { ClipboardService } from '@app/drawing/services/clipboard.service';

describe('ClipboardService', () => {
    let service: ClipboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClipboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
