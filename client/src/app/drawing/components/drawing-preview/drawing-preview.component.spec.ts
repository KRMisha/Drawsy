import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';

describe('DrawingPreviewComponent', () => {
    let component: DrawingPreviewComponent;
    let fixture: ComponentFixture<DrawingPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingPreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
