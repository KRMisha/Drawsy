import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
import { SettingsComponent } from '@app/modals/components/settings/settings/settings.component';
import { ModalService } from '@app/modals/services/modal.service';

describe('ModalService', () => {
    let expectedSecondParameter = {
        width: '',
        height: 'auto',
        maxHeight: '95vh',
        panelClass: 'theme-dialog',
    };
    let matDialogSpyObj: jasmine.SpyObj<MatDialog>;
    let service: ModalService;
    let openDialogSpy: jasmine.Spy;

    beforeEach(() => {
        expectedSecondParameter = {
            width: '',
            height: 'auto',
            maxHeight: '95vh',
            panelClass: 'theme-dialog',
        };
        matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open'], {
            openDialogs: { length: 0 },
        });
        TestBed.configureTestingModule({
            providers: [{ provide: MatDialog, useValue: matDialogSpyObj }],
        });

        service = TestBed.inject(ModalService);
        openDialogSpy = spyOn<any>(service, 'openDialog').and.callThrough(); // tslint:disable-line: no-any
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#openDialog should not open a modal if there is already a modal being displayed', () => {
        // tslint:disable-next-line: no-string-literal
        service['dialog'] = jasmine.createSpyObj('MatDialog', ['open'], {
            openDialogs: { length: 1 },
        });
        service.openNewDrawingModal();
        const width = 325;
        expectedSecondParameter.width = `${width}px`;
        expect(openDialogSpy).toHaveBeenCalledWith(NewDrawingComponent, width, false);
        expect(matDialogSpyObj.open).not.toHaveBeenCalled();
    });

    it('#openNewDrawingModal should open a modal of the appropriate width containing NewDrawingComponent', () => {
        service.openNewDrawingModal();
        const width = 325;
        expectedSecondParameter.width = `${width}px`;
        expect(openDialogSpy).toHaveBeenCalledWith(NewDrawingComponent, width, false);

        expect(matDialogSpyObj.open).toHaveBeenCalledWith(NewDrawingComponent, expectedSecondParameter);
    });

    it('#openExportDrawingModal should open a modal of the appropriate width containing ExportDrawingComponent', () => {
        service.openExportDrawingModal();
        const width = 920;
        expect(openDialogSpy).toHaveBeenCalledWith(ExportDrawingComponent, width, false);
        expectedSecondParameter.width = `${width}px`;
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(ExportDrawingComponent, expectedSecondParameter);
    });

    it('#openSaveDrawingModal should open a modal of the appropriate width containing SaveDrawingComponent', () => {
        service.openSaveDrawingModal();
        const width = 920;
        expect(openDialogSpy).toHaveBeenCalledWith(SaveDrawingComponent, width, false);
        expectedSecondParameter.width = `${width}px`;
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(SaveDrawingComponent, expectedSecondParameter);
    });

    it('#openGalleryModal should open a modal of the appropriate width containing GalleryComponent', () => {
        service.openGalleryModal();
        const width = 1920;
        expect(openDialogSpy).toHaveBeenCalledWith(GalleryComponent, width, false);
        expectedSecondParameter.width = `${width}px`;
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(GalleryComponent, expectedSecondParameter);
    });

    it('#openSettingsModal should open a modal of the appropriate width containing openSettingsModal', () => {
        service.openSettingsModal();
        const width = 325;
        expect(openDialogSpy).toHaveBeenCalledWith(SettingsComponent, width, false);
        expectedSecondParameter.width = `${width}px`;
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(SettingsComponent, expectedSecondParameter);
    });

    it('#openGuideModal should open a modal of the appropriate width containing GuideComponent', () => {
        service.openGuideModal();
        const width = 1920;
        expect(openDialogSpy).toHaveBeenCalledWith(GuideComponent, width, true);
        expectedSecondParameter.width = `${width}px`;
        expectedSecondParameter.height = '100%';
        expect(matDialogSpyObj.open).toHaveBeenCalledWith(GuideComponent, expectedSecondParameter);
    });
});
