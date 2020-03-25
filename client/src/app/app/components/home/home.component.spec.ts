import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { HomeComponent } from '@app/app/components/home/home.component';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ModalService } from '@app/modals/services/modal.service';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;
    beforeEach(async(() => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', ['openDialog']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['isDrawingStarted']);

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

    // it('#openNewDrawingModal should forward request to Modal service', () => {
    //     component.openNewDrawingModal();
    //     expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(NewDrawingComponent, { x: 425, y: 500 });
    // });

    // it('#openGuideModal should forward request to Modal service', () => {
    //     component.openGuideModal();
    //     expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
    // });

    // it('#openGalleryModal should forward request to Modal service', () => {
    //     component.openGalleryModal();
    //     expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GalleryComponent, { x: 1920, y: 900 });
    // });

    // it('#continueDrawing should route to /editor using angulars router', () => {
    //     component.continueDrawing();
    //     expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    // });
});
