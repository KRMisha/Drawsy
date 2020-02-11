import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorContainerComponent } from './color-container.component';

describe('ColorContainerComponent', () => {
    let component: ColorContainerComponent;
    let fixture: ComponentFixture<ColorContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorContainerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
