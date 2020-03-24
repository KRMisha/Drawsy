// import { Type } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Vec2 } from '@app/classes/vec2';
// import { ModalService } from '@app/modals/services/modal.service';
// import { of } from 'rxjs';

// // tslint:disable: no-any

// describe('ModalService', () => {
//     let service: ModalService;
//     let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
//     let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<Type<any>>>;

//     beforeEach(() => {
//         dialogRefSpyObj = jasmine.createSpyObj({
//             afterClosed: of({}),
//         });
//         matDialogSpyObj = jasmine.createSpyObj({
//             open: dialogRefSpyObj,
//         });
//         TestBed.configureTestingModule({
//             providers: [{ provide: MatDialog, useValue: matDialogSpyObj }],
//         });
//         service = TestBed.inject(ModalService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('#openDialog should open a dialog with the implicit dimensions if none are provided', () => {
//         spyOn(service, 'openDialog').and.callThrough();
//         // service.openDialog({} as any);
//         expect(service.openDialog).toHaveBeenCalled();
//         expect(matDialogSpyObj.open).toHaveBeenCalledWith({} as any, {});
//         expect(service.isModalPresent).toEqual(true);
//     });

//     it('#openDialog should open a dialog with the specified dimensions when they are provided', () => {
//         spyOn(service, 'openDialog').and.callThrough();
//         service.openDialog({} as any, { x: 4, y: 4 } as Vec2);
//         expect(service.openDialog).toHaveBeenCalled();
//         expect(matDialogSpyObj.open).toHaveBeenCalledWith({} as any, { width: '4px', height: '4px' });
//         expect(service.isModalPresent).toEqual(true);
//     });

//     it('#openDialog should not open a dialog if a modal is already present', () => {
//         spyOn(service, 'openDialog').and.callThrough();
//         service['_isModalPresent'] = true; // tslint:disable-line: no-string-literal
//         // service.openDialog({} as any);
//         expect(matDialogSpyObj.open).not.toHaveBeenCalled();
//     });
// });
