import { TestBed } from '@angular/core/testing';
import { ServerService } from '@app/server/services/server.service';

describe('ServerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ServerService = TestBed.inject(ServerService);
        expect(service).toBeTruthy();
    });
});
