import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideEllipseComponent } from './guide-ellipse.component';

describe('GuideEllipseComponent', () => {
    let component: GuideEllipseComponent;
    let fixture: ComponentFixture<GuideEllipseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideEllipseComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideEllipseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
