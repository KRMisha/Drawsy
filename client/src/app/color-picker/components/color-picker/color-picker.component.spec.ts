import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { ColorService } from '@app/drawing/services/color.service';
import { Color } from '@app/shared/classes/color';
import { Subject } from 'rxjs';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;
    let colorChangedSubject: Subject<Color>;

    beforeEach(async(() => {
        colorChangedSubject = new Subject<Color>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor', 'setColor'], {
            colorChanged$: colorChangedSubject,
        });

        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [{ provide: ColorService, useValue: colorPickerServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
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

    // it('#set paletteColor should emit color change', () => {
    //     component.paletteColor = new Color();
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it("#set defaultColor should only change be able to modify the palettte's color once", () => {
    //     component.defaultColor = new Color();
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    //     component.defaultColor = new Color();
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#setHue should emit color change', () => {
    //     component.setHue(123);
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#setAplha should emit color change', () => {
    //     component.setAlpha(0);
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#setSaturationAndValue should emit color change', () => {
    //     component.setSaturationAndValue([12, 12]);
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#updateColorFromHex should emit color change', () => {
    //     component.updateColorFromHex(new Color());
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#getPreviousColors should call #getPreviousColors of colorService', () => {
    //     component.getPreviousColors();
    //     expect(colorServiceSpyObj.getPreviousColors).toHaveBeenCalled();
    // });

    // it("#oldColorClick should set colorService's primary color when using a left click", () => {
    //     component.oldColorClick({ button: 0 } as MouseEvent, new Color());
    //     expect(colorServiceSpyObj.setPrimaryColor).toHaveBeenCalledTimes(1);
    // });

    // it("#oldColorClick should set colorService's primary color when using a right click", () => {
    //     component.oldColorClick({ button: 2 } as MouseEvent, new Color());
    //     expect(colorServiceSpyObj.setSecondaryColor).toHaveBeenCalledTimes(1);
    // });

    // it('#oldColorClick should emit colorChanged and previousColorSelected', () => {
    //     component.oldColorClick({ button: 0 } as MouseEvent, new Color());
    //     expect(component.previousColorSelected.emit).toHaveBeenCalledTimes(1);
    //     expect(component.colorChanged.emit).toHaveBeenCalledTimes(1);
    // });

    // it('#oldColorClick should do nothing if mouse button is not left or right click', () => {
    //     component.oldColorClick({ button: 69 } as MouseEvent, new Color());
    //     expect(component.previousColorSelected.emit).not.toHaveBeenCalled();
    //     expect(component.colorChanged.emit).not.toHaveBeenCalled();
    // });
});
