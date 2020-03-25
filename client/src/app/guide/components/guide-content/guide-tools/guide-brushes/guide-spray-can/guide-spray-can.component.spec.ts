import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSprayCanComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spray-can/guide-spray-can.component';

describe('GuideSprayCanComponent', () => {
    let component: GuideSprayCanComponent;
    let fixture: ComponentFixture<GuideSprayCanComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideSprayCanComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSprayCanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
