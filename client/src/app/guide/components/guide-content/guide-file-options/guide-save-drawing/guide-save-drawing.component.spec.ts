import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSaveDrawingComponent } from './guide-save-drawing.component';

describe('GuideSaveDrawingComponent', () => {
    let component: GuideSaveDrawingComponent;
    let fixture: ComponentFixture<GuideSaveDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSaveDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
