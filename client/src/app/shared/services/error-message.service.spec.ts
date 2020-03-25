import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

describe('ErrorMessageService', () => {
    let service: ErrorMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ErrorMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
