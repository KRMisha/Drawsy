import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { HomeComponent } from '@app/home/components/home/home.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let modalServiceSpyObj: jasmine.SpyObj<ModalService>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    beforeEach(async(() => {
        modalServiceSpyObj = jasmine.createSpyObj('ModalService', ['openDialog']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['isDrawingStarted']);
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [MatSidenavModule, MatCardModule, MatDialogModule],
            providers: [
                {provide: DrawingService, useValue: drawingServiceSpyObj},
                {provide: ModalService, useValue: modalServiceSpyObj},
                {provide: Router, useValue: routerSpyObj},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#openNewDrawingModal should forward request to Modal service', () => {
        component.openNewDrawingModal();
        expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(NewDrawingComponent, { x: 425, y: 500 });
    });

    it('#openGuideModal should forward request to Modal service', () => {
        component.openGuideModal();
        expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
    });

    it('#openGalleryModal should forward request to Modal service', () => {
        component.openGalleryModal();
        expect(modalServiceSpyObj.openDialog).toHaveBeenCalledWith(GalleryComponent, { x: 1920, y: 900 });
    });

    it('#continueDrawing should route to /editor using angular\s router', () => {
        component.continueDrawing();
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    })
});
