import { TestBed } from '@angular/core/testing';

import { DrawingSerializerService } from './drawing-serializer.service';

describe('DrawingSerializerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingSerializerService = TestBed.get(DrawingSerializerService);
        expect(service).toBeTruthy();
    });
});
