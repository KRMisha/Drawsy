import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { HomeComponent } from '@app/app/components/home/home.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ModalService } from '@app/modals/services/modal.service';

fdescribe('HomeComponent', () => {
    let component: HomeComponent;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;
    beforeEach(async(() => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', [
            'openNewDrawingModal',
            'openGalleryModal',
            'openGuideModal',
        ]);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['isDrawingStarted']);
        drawingServiceSpyObj.isDrawingStarted.and.returnValue(true);
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ModalService, useValue: modalServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#openNewDrawingModal should forward request to Modal service', () => {
        component.openNewDrawingModal();
        expect(modalServiceSpyObj.openNewDrawingModal).toHaveBeenCalled();
    });

    it('#openGalleryModal should forward request to Modal service', () => {
        component.openGalleryModal();
        expect(modalServiceSpyObj.openGalleryModal).toHaveBeenCalled();
    });

    it('#openGuideModal should forward request to Modal service', () => {
        component.openGuideModal();
        expect(modalServiceSpyObj.openGuideModal).toHaveBeenCalled();
    });

    it('#get isDrawingStarted should forward request to drawingService', () => {
        const returnValue = component.isDrawingStarted;
        expect(drawingServiceSpyObj.isDrawingStarted).toHaveBeenCalled();
        expect(returnValue).toBeTruthy();
    });
});
