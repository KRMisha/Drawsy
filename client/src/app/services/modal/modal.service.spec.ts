import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from './modal.service';

describe('ModalService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: MatDialog, useValue: {} as MatDialog }],
        });
    }));

    it('should be created', () => {
        const service: ModalService = TestBed.get(ModalService);
        expect(service).toBeTruthy();
    });
});
