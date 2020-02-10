import { Type } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Vec2 } from 'src/app/classes/vec2/vec2';
import { ModalService } from './modal.service';

fdescribe('ModalService', () => {
    let service: ModalService;
    let matDialog: MatDialog;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: MatDialog, useValue: {} as MatDialog} }]
        });

        service = TestBed.get(ModalService);
        matDialog = TestBed.get(MatDialog);
        spyOn(matDialog, 'open');
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return isModalPresent boolean attribute', () => {
        expect(service.isModalPresent).toEqual(false);
    })

    it('should open default dialog if no dimensions are specified', async(() => {
        service.openDialog({} as any);
        expect(matDialog.open).toHaveBeenCalledWith([{}, {}]);
    }))
});
