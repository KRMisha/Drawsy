import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { SidebarColorPickerComponent } from '@app/editor/components/sidebar-color-picker/sidebar-color-picker.component';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('SidebarColorPickerComponent', () => {
    let component: SidebarColorPickerComponent;
    let fixture: ComponentFixture<SidebarColorPickerComponent>;
    let primaryColorSpyObj: jasmine.SpyObj<Color>;
    let secondaryColorSpyObj: jasmine.SpyObj<Color>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;

    beforeEach(async(() => {
        primaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbString', 'getHex']);
        secondaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbString', 'getHex']);
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', ['swapPrimaryAndSecondaryColors'], {
            primaryColor: primaryColorSpyObj,
            secondaryColor: secondaryColorSpyObj,
            lastColors: [primaryColorSpyObj, secondaryColorSpyObj],
        });
        TestBed.configureTestingModule({
            declarations: [SidebarColorPickerComponent],
            providers: [{ provide: ColorService, useValue: colorServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onMouseDown should call #confirmColor if the mouse is not inside the component and the color picker is displayed', () => {
        component['isMouseInside'] = false;
        component['isColorPickerDisplayEnabled'] = true;
        const confirmColorSpy = spyOn<any>(component, 'confirmColor');
        component.onMouseDown();
        expect(confirmColorSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should not call #confirmColor if the mouse is inside the component', () => {
        component['isMouseInside'] = true;
        const confirmColorSpy = spyOn<any>(component, 'confirmColor');
        component.onMouseDown();
        expect(confirmColorSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should not call #confirmColor if the color picker is not displayed', () => {
        component['isColorPickerDisplayEnabled'] = false;
        const confirmColorSpy = spyOn<any>(component, 'confirmColor');
        component.onMouseDown();
        expect(confirmColorSpy).not.toHaveBeenCalled();
    });

    it('#onMouseEnter should set isMouseInside to true', () => {
        component['isMouseInside'] = false;
        component.onMouseEnter();
        expect(component['isMouseInside']).toEqual(true);
    });

    it('#onMouseLeave should set isMouseInside to false', () => {
        component['isMouseInside'] = true;
        component.onMouseLeave();
        expect(component['isMouseInside']).toEqual(false);
    });

    it("#selectPrimaryColor should set isPrimaryColorSelected to true and set isColorPickerDisplayEnabled to true, as well as set color to colorService's primary color", () => {
        component['isPrimaryColorSelected'] = false;
        component['isColorPickerDisplayEnabled'] = false;
        component['color'] = secondaryColorSpyObj;
        component.selectPrimaryColor();
        expect(component['isPrimaryColorSelected']).toEqual(true);
        expect(component['isColorPickerDisplayEnabled']).toEqual(true);
        expect(component['color']).toBe(primaryColorSpyObj);
    });

    it("#selectSecondaryColor should set isPrimaryColorSelected to false and set isColorPickerDisplayEnabled to true, as well as set color to colorService's secondary color", () => {
        component['isPrimaryColorSelected'] = true;
        component['isColorPickerDisplayEnabled'] = false;
        component['color'] = primaryColorSpyObj;
        component.selectSecondaryColor();
        expect(component['isPrimaryColorSelected']).toEqual(false);
        expect(component['isColorPickerDisplayEnabled']).toEqual(true);
        expect(component['color']).toBe(secondaryColorSpyObj);
    });

    it("#swapColors should call colorService's swapPrimaryAndSecondaryColors and set color to the primary color if isPrimaryColorSelected is true", () => {
        component['isPrimaryColorSelected'] = true;
        component.swapColors();
        expect(colorServiceSpyObj.swapPrimaryAndSecondaryColors).toHaveBeenCalled();
        expect(component['color']).toBe(primaryColorSpyObj);
    });

    it("#swapColors should call colorService's swapPrimaryAndSecondaryColors and set color to the secondary color if isPrimaryColorSelected is false", () => {
        component['isPrimaryColorSelected'] = false;
        component.swapColors();
        expect(colorServiceSpyObj.swapPrimaryAndSecondaryColors).toHaveBeenCalled();
        expect(component['color']).toBe(secondaryColorSpyObj);
    });

    it('#onlastColorClick should change the color, change the secondary color and set isColorPickerDisplayEnabled to false if the right mouse button is pressed', () => {
        component['isColorPickerDisplayEnabled'] = true;
        const colorServiceMock = { primaryColor: {} as Color, secondaryColor: {} as Color } as ColorService;
        component['colorService'] = colorServiceMock;
        const event = { button: MouseButton.Right } as MouseEvent;
        const colorStub = {} as Color;
        component.onLastColorClick(event, colorStub);
        expect(component['color']).toBe(colorStub);
        expect(component.secondaryColor).toBe(colorStub);
        expect(component['isColorPickerDisplayEnabled']).toEqual(false);
    });

    it('#onlastColorClick should change the color, change the primary color and set isColorPickerDisplayEnabled to false if the left mouse button is pressed', () => {
        component['isColorPickerDisplayEnabled'] = true;
        const colorServiceMock = { primaryColor: {} as Color, secondaryColor: {} as Color } as ColorService;
        component['colorService'] = colorServiceMock;
        const event = { button: MouseButton.Left } as MouseEvent;
        const colorStub = {} as Color;
        component.onLastColorClick(event, colorStub);
        expect(component['color']).toBe(colorStub);
        expect(component.primaryColor).toBe(colorStub);
        expect(component['isColorPickerDisplayEnabled']).toEqual(false);
    });

    it('#onPreviousClick should change the color and set isColorPickerDisplayEnabled to false, but not change the primary or secondary color if the mouse button is not the left or right button', () => {
        component['isColorPickerDisplayEnabled'] = true;
        const colorServiceMock = { primaryColor: {} as Color, secondaryColor: {} as Color } as ColorService;
        component['colorService'] = colorServiceMock;
        const event = { button: MouseButton.Forward } as MouseEvent;
        const colorStub = {} as Color;
        component.onLastColorClick(event, colorStub);
        expect(component['color']).toBe(colorStub);
        expect(component.primaryColor).not.toBe(colorStub);
        expect(component.secondaryColor).not.toBe(colorStub);
        expect(component['isColorPickerDisplayEnabled']).toEqual(false);
    });

    it('#confirmColor should set isColorPickerDisplayEnabled to false and set primaryColor if isPrimaryColorSelected is true', () => {
        component['isColorPickerDisplayEnabled'] = true;
        component['isPrimaryColorSelected'] = true;
        const colorServiceMock = { primaryColor: {} as Color, secondaryColor: {} as Color } as ColorService;
        component['colorService'] = colorServiceMock;
        const colorStub = {} as Color;
        component['color'] = colorStub;
        component.confirmColor();
        expect(component.primaryColor).toBe(colorStub);
        expect(component['isColorPickerDisplayEnabled']).toEqual(false);
    });

    it('#confirmColor should set isColorPickerDisplayEnabled to false and set secondaryColor if isPrimaryColorSelected is false', () => {
        component['isColorPickerDisplayEnabled'] = true;
        component['isPrimaryColorSelected'] = false;
        const colorServiceMock = { primaryColor: {} as Color, secondaryColor: {} as Color } as ColorService;
        component['colorService'] = colorServiceMock;
        const colorStub = {} as Color;
        component['color'] = colorStub;
        component.confirmColor();
        expect(component.secondaryColor).toBe(colorStub);
        expect(component['isColorPickerDisplayEnabled']).toEqual(false);
    });
});
