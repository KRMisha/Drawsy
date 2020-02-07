import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule } from '@angular/material/slider';
import { ColorContainerComponent } from './color-container/color-container.component';
import { ColorFieldComponent } from './color-field/color-field.component';
import { ColorPickerComponent } from './color-picker.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [MatSliderModule],
        declarations: [
          ColorPickerComponent,
          ColorContainerComponent,
          ColorSliderComponent,
          ColorFieldComponent
        ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
