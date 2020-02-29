import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { HomeComponent } from '@app/home/components/home/home.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let mockModalService: ModalService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            imports: [MatSidenavModule, MatCardModule, MatDialogModule],
            providers: [
                {
                    provide: ModalService,
                    useValue: {
                        openDialog: () => {
                            return;
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        mockModalService = TestBed.get(ModalService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#openNewDrawing should forward request to Modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openNewDrawingModal();
        expect(mockModalService.openDialog).toHaveBeenCalledWith(NewDrawingComponent);
    });

    it('#openGuideModal should forward request to Modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openGuideModal();
        expect(mockModalService.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
    });
});
