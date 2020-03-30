import { TestBed } from '@angular/core/testing';

import { ToolSelectionUiService } from './tool-selection-ui.service';

describe('ToolSelectionUiService', () => {
    let service: ToolSelectionUiService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionUiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
