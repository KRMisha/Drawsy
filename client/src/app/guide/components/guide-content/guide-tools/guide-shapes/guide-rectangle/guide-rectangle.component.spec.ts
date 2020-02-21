import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideRectangleComponent } from './guide-rectangle.component';

describe('GuideRectangleComponent', () => {
    let component: GuideRectangleComponent;
    let fixture: ComponentFixture<GuideRectangleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideRectangleComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideRectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
