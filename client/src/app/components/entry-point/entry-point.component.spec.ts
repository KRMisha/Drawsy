import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ModalService } from 'src/app/services/modal/modal.service';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { GuideComponent } from '../guide/guide.component';
import { EntryPointComponent } from './entry-point.component';

describe('EntryPointComponent', () => {
    let component: EntryPointComponent;
    let fixture: ComponentFixture<EntryPointComponent>;
    let mockModalService: ModalService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EntryPointComponent],
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
        fixture = TestBed.createComponent(EntryPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#openCreateDrawing should forward request to Modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openCreateDrawing();
        expect(mockModalService.openDialog).toHaveBeenCalledWith(CreateDrawingComponent);
    });

    it('#openGuideModal should forward request to Modal service', () => {
        spyOn(mockModalService, 'openDialog');
        component.openGuideModal();
        expect(mockModalService.openDialog).toHaveBeenCalledWith(GuideComponent, { x: 1920, y: 1080 });
    });
});
