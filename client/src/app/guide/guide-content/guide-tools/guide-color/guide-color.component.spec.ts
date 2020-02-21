import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideColorComponent } from './guide-color.component';

describe('GuideColorComponent', () => {
    let component: GuideColorComponent;
    let fixture: ComponentFixture<GuideColorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideColorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
