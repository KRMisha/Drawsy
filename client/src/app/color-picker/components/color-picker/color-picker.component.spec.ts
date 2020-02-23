import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Color } from '@app/classes/color';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { ColorService } from '@app/drawing/services/color.service';

// tslint:disable: no-magic-numbers

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;

    beforeEach(async(() => {
        const lastColorsMock: Color[] = [];
        for (let i = 0; i < 10; i++) {
            lastColorsMock.push(new Color());
        }
        // tslint:disable: no-empty
        colorServiceSpyObj = jasmine.createSpyObj({
            getLastColors: lastColorsMock,
            setPrimaryColor: () => {},
            setSecondaryColor: () => {},
        });
        // tslint:enable: no-empty

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
        spyOn(component.previousColorSelected, 'emit').and.callThrough();
        spyOn(component.colorChanged, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#set paletteColor should emit color change', () => {
        component.paletteColor = new Color();
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it("#set defaultColor should only change be able to modify the palettte's color once", () => {
        component.defaultColor = new Color();
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
        component.defaultColor = new Color();
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#setHue should emit color change', () => {
        component.setHue(123);
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#setAplha should emit color change', () => {
        component.setAlpha(0);
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#setSaturationAndValue should emit color change', () => {
        component.setSaturationAndValue([12, 12]);
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#updateColorFromHex should emit color change', () => {
        component.updateColorFromHex(new Color());
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#getLastColors should call #getLastColors of colorService', () => {
        component.getLastColors();
        expect(colorServiceSpyObj.getLastColors).toHaveBeenCalled();
    });

    it("#oldColorClick should set colorService's primary color when using a left click", () => {
        component.oldColorClick({ button: 0 } as MouseEvent, new Color());
        expect(colorServiceSpyObj.setPrimaryColor).toHaveBeenCalledTimes(1);
    });

    it("#oldColorClick should set colorService's primary color when using a right click", () => {
        component.oldColorClick({ button: 2 } as MouseEvent, new Color());
        expect(colorServiceSpyObj.setSecondaryColor).toHaveBeenCalledTimes(1);
    });

    it('#oldColorClick should emit colorChanged and previousColorSelected', () => {
        component.oldColorClick({ button: 0 } as MouseEvent, new Color());
        expect(component.previousColorSelected.emit).toHaveBeenCalledTimes(1);
        expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    });

    it('#oldColorClick should do nothing if mouse button is not left or right click', () => {
        component.oldColorClick({ button: 69 } as MouseEvent, new Color());
        expect(component.previousColorSelected.emit).not.toHaveBeenCalled();
        expect(component.colorChanged.emit).not.toHaveBeenCalled();
    });
});
