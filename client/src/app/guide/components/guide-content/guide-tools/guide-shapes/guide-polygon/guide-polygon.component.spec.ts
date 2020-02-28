import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidePolygonComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';

describe('GuidePolygonComponent', () => {
    let component: GuidePolygonComponent;
    let fixture: ComponentFixture<GuidePolygonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuidePolygonComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuidePolygonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
