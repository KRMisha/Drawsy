import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSprayPaintComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spray-paint/guide-spray-paint.component';

describe('GuideSprayPaintComponent', () => {
    let component: GuideSprayPaintComponent;
    let fixture: ComponentFixture<GuideSprayPaintComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSprayPaintComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSprayPaintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
