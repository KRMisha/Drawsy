import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaSliderComponent } from '@app/color-picker/components/alpha-slider/alpha-slider.component';

describe('AlphaSliderComponent', () => {
    let component: AlphaSliderComponent;
    let fixture: ComponentFixture<AlphaSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlphaSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlphaSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
