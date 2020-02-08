import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Color } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;

    beforeEach(async(() => {
        const lastColorsMock: Color[] = [];
        for (let i = 0; i < 10; i++) {
            lastColorsMock.push(new Color());
        }
        colorServiceSpyObj = jasmine.createSpyObj({
            getLastColors: lastColorsMock,
            setPrimaryColor: () => {},
            setSecondaryColor: () => {},
        });

        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            imports: [MatSliderModule, ReactiveFormsModule, FormsModule],
            providers: [{ provide: ColorService, useValue: colorServiceSpyObj }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
