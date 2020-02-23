import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Color } from '@app/classes/color';
import { ColorService } from 'src/app/drawing/services/color.service';
import { ToolSetting } from 'src/app/tools/services/tool';
import { ToolSelectorService } from 'src/app/tools/services/tool-selector.service';
import { SidebarDrawerComponent } from './sidebar-drawer.component';

// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SidebarDrawerComponent', () => {
    let component: SidebarDrawerComponent;
    let fixture: ComponentFixture<SidebarDrawerComponent>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let toolSelectorServiceSpyObj: jasmine.SpyObj<ToolSelectorService>;

    beforeEach(async(() => {
        toolSelectorServiceSpyObj = jasmine.createSpyObj({
            hasSetting: () => {},
            getToolName: () => {},
            getSetting: () => {},
            setSetting: () => {},
        });

        colorServiceSpyObj = jasmine.createSpyObj({
            getPrimaryColor: () => {},
            getSecondaryColor: () => {},
            setPrimaryColor: () => {},
            setSecondaryColor: () => {},
            swapPrimaryAndSecondaryColors: () => {},
        });
        TestBed.configureTestingModule({
            declarations: [SidebarDrawerComponent],
            imports: [BrowserAnimationsModule, MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarDrawerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#getToolName() should call getToolName from toolSelectorService', () => {
        spyOn(component, 'getToolName').and.callThrough();
        component.getToolName();
        expect(component.getToolName).toHaveBeenCalled();
        expect(component['toolSelectorService'].getToolName).toHaveBeenCalled();
    });

    it('#getSetting() should call getSetting from toolSelectorService with the chosen ToolSetting', () => {
        spyOn(component, 'getSetting').and.callThrough();
        component.getSetting(ToolSetting.Size);
        expect(component.getSetting).toHaveBeenCalled();
        expect(component['toolSelectorService'].getSetting).toHaveBeenCalledWith(ToolSetting.Size);
    });

    it('#setSetting() should call getSetting from toolSelectorService with the chosen ToolSetting and value', () => {
        spyOn(component, 'setSetting').and.callThrough();
        component.setSetting(ToolSetting.Size, 3);
        expect(component.setSetting).toHaveBeenCalled();
        expect(component['toolSelectorService'].setSetting).toHaveBeenCalledWith(ToolSetting.Size, 3);
    });

    it('#hasSetting() should call hasSetting from toolSelectorService with the chosen ToolSetting', () => {
        spyOn(component, 'hasSetting').and.callThrough();
        component.hasSetting(ToolSetting.Size);
        expect(component.hasSetting).toHaveBeenCalled();
        expect(component['toolSelectorService'].hasSetting).toHaveBeenCalledWith(ToolSetting.Size);
    });

    it('#getPrimaryColor() should call getPrimaryColor from toolSelectorService', () => {
        spyOn(component, 'getPrimaryColor').and.callThrough();
        component.getPrimaryColor();
        expect(component.getPrimaryColor).toHaveBeenCalled();
        expect(component['colorService'].getPrimaryColor).toHaveBeenCalled();
    });

    it('#getSecondaryColor() should call getSecondaryColor from toolSelectorService', () => {
        spyOn(component, 'getSecondaryColor').and.callThrough();
        component.getSecondaryColor();
        expect(component.getSecondaryColor).toHaveBeenCalled();
        expect(component['colorService'].getSecondaryColor).toHaveBeenCalled();
    });

    it('#selectPrimaryColor() should set isPrimarySelected and isColorPickerDisplayEnabled to true', () => {
        component.isPrimarySelected = false;
        component.isColorPickerDisplayEnabled = false;
        component.selectPrimaryColor();
        expect(component.isPrimarySelected).toEqual(true);
        expect(component.isColorPickerDisplayEnabled).toEqual(true);
    });

    it('#selectSecondaryColor() should set isPrimarySelected to false and isColorPickerDisplayEnabled to true', () => {
        component.isPrimarySelected = true;
        component.isColorPickerDisplayEnabled = false;
        component.selectSecondaryColor();
        expect(component.isPrimarySelected).toEqual(false);
        expect(component.isColorPickerDisplayEnabled).toEqual(true);
    });

    it('#updateColor() should set the color attribute to parameter color', () => {
        const color = {} as Color;
        component.updateColor(color);
        expect(component['color']).toEqual(color);
    });

    it('#confirmColor() should set isColorPickerDisplayEnabled to false and call color service setPrimaryColor if isPrimarySelected is true', () => {
        component.isPrimarySelected = true;
        component.isColorPickerDisplayEnabled = true;
        component['color'] = {} as Color;
        component.confirmColor();
        expect(component.isColorPickerDisplayEnabled).toEqual(false);
        expect(component['colorService'].setPrimaryColor).toHaveBeenCalledWith(component['color']);
    });

    it('#confirmColor() should set isColorPickerDisplayEnabled to false and call color service setSecondaryColor if isPrimarySelected is false', () => {
        component.isPrimarySelected = false;
        component.isColorPickerDisplayEnabled = true;
        component['color'] = {} as Color;
        component.confirmColor();
        expect(component.isColorPickerDisplayEnabled).toEqual(false);
        expect(component['colorService'].setSecondaryColor).toHaveBeenCalledWith(component['color']);
    });

    it('#swapColors() should call swapPrimaryAndSecondaryColors() from the color service', () => {
        spyOn(component, 'swapColors').and.callThrough();
        component.swapColors();
        expect(component.swapColors).toHaveBeenCalled();
        expect(component['colorService'].swapPrimaryAndSecondaryColors).toHaveBeenCalled();
    });

    it('#getSelectedColor() should call getPrimaryColor() from the color service if isPrimarySelected is true', () => {
        component.isPrimarySelected = true;
        spyOn(component, 'getSelectedColor').and.callThrough();
        component.getSelectedColor();
        expect(component.getSelectedColor).toHaveBeenCalled();
        expect(component['colorService'].getPrimaryColor).toHaveBeenCalled();
    });

    it('#getSelectedColor() should call getSecondaryColor() from the color service if isPrimarySelected is false', () => {
        component.isPrimarySelected = false;
        spyOn(component, 'getSelectedColor').and.callThrough();
        component.getSelectedColor();
        expect(component.getSelectedColor).toHaveBeenCalled();
        expect(component['colorService'].getSecondaryColor).toHaveBeenCalled();
    });
});
