// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSliderModule } from '@angular/material/slider';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ColorService } from '@app/drawing/services/color.service';
// import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
// import { CurrentToolService } from '@app/tools/services/current-tool.service';

// // tslint:disable: no-empty
// // tslint:disable: no-magic-numbers
// // tslint:disable: no-string-literal

// describe('SidebarDrawerComponent', () => {
//     let component: SidebarDrawerComponent;
//     let fixture: ComponentFixture<SidebarDrawerComponent>;
//     let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
//     let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;

//     beforeEach(async(() => {
//         currentToolServiceSpyObj = jasmine.createSpyObj({
//             hasSetting: () => {},
//             getToolName: () => {},
//             getSetting: () => {},
//             setSetting: () => {},
//         });

//         colorServiceSpyObj = jasmine.createSpyObj({
//             getPrimaryColor: () => {},
//             getSecondaryColor: () => {},
//             setPrimaryColor: () => {},
//             setSecondaryColor: () => {},
//             swapPrimaryAndSecondaryColors: () => {},
//         });
//         TestBed.configureTestingModule({
//             declarations: [SidebarDrawerComponent],
//             imports: [BrowserAnimationsModule, MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
//             providers: [
//                 { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
//                 { provide: ColorService, useValue: colorServiceSpyObj },
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SidebarDrawerComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('#getToolName() should call getToolName from currentToolService', () => {
//         spyOn(component, 'getToolName').and.callThrough();
//         component.getToolName();
//         expect(component.getToolName).toHaveBeenCalled();
//         expect(component['currentToolService'].getToolName).toHaveBeenCalled();
//     });

//     it('#getSetting() should call getSetting from currentToolService with the chosen ToolSetting', () => {
//         spyOn(component, 'getSetting').and.callThrough();
//         component.getSetting(ToolSetting.LineWidth);
//         expect(component.getSetting).toHaveBeenCalled();
//         expect(component['currentToolService'].getSetting).toHaveBeenCalledWith(ToolSetting.LineWidth);
//     });

//     it('#setSetting() should call getSetting from currentToolService with the chosen ToolSetting and value', () => {
//         spyOn(component, 'setSetting').and.callThrough();
//         component.setSetting(ToolSetting.LineWidth, 3);
//         expect(component.setSetting).toHaveBeenCalled();
//         expect(component['currentToolService'].setSetting).toHaveBeenCalledWith(ToolSetting.LineWidth, 3);
//     });

//     it('#hasSetting() should call hasSetting from currentToolService with the chosen ToolSetting', () => {
//         spyOn(component, 'hasSetting').and.callThrough();
//         component.hasSetting(ToolSetting.LineWidth);
//         expect(component.hasSetting).toHaveBeenCalled();
//         expect(component['currentToolService'].hasSetting).toHaveBeenCalledWith(ToolSetting.LineWidth);
//     });

//     it('#getPrimaryColor() should call getPrimaryColor from currentToolService', () => {
//         spyOn(component, 'getPrimaryColor').and.callThrough();
//         component.getPrimaryColor();
//         expect(component.getPrimaryColor).toHaveBeenCalled();
//         expect(component['colorService'].getPrimaryColor).toHaveBeenCalled();
//     });

//     it('#getSecondaryColor() should call getSecondaryColor from currentToolService', () => {
//         spyOn(component, 'getSecondaryColor').and.callThrough();
//         component.getSecondaryColor();
//         expect(component.getSecondaryColor).toHaveBeenCalled();
//         expect(component['colorService'].getSecondaryColor).toHaveBeenCalled();
//     });

//     it('#selectPrimaryColor() should set isPrimarySelected and isColorPickerDisplayEnabled to true', () => {
//         component.isPrimarySelected = false;
//         component.isColorPickerDisplayEnabled = false;
//         component.selectPrimaryColor();
//         expect(component.isPrimarySelected).toEqual(true);
//         expect(component.isColorPickerDisplayEnabled).toEqual(true);
//     });

//     it('#selectSecondaryColor() should set isPrimarySelected to false and isColorPickerDisplayEnabled to true', () => {
//         component.isPrimarySelected = true;
//         component.isColorPickerDisplayEnabled = false;
//         component.selectSecondaryColor();
//         expect(component.isPrimarySelected).toEqual(false);
//         expect(component.isColorPickerDisplayEnabled).toEqual(true);
//     });

//     it('#updateColor() should set the color attribute to parameter color', () => {
//         const color = {} as Color;
//         component.updateColor(color);
//         expect(component['color']).toEqual(color);
//     });

//     it('#confirmColor() should set isColorPickerDisplayEnabled to false and ' +
//        'call color service setPrimaryColor if isPrimaryColorSelected is true', () => {
//         component.isPrimarySelected = true;
//         component.isColorPickerDisplayEnabled = true;
//         component['color'] = {} as Color;
//         component.confirmColor();
//         expect(component.isColorPickerDisplayEnabled).toEqual(false);
//         expect(component['colorService'].setPrimaryColor).toHaveBeenCalledWith(component['color']);
//     });

//     it('#confirmColor() should set isColorPickerDisplayEnabled to false and ' +
//        'call color service setSecondaryColor if isPrimaryColorSelected is false', () => {
//         component.isPrimarySelected = false;
//         component.isColorPickerDisplayEnabled = true;
//         component['color'] = {} as Color;
//         component.confirmColor();
//         expect(component.isColorPickerDisplayEnabled).toEqual(false);
//         expect(component['colorService'].setSecondaryColor).toHaveBeenCalledWith(component['color']);
//     });

//     it('#swapColors() should call swapPrimaryAndSecondaryColors() from the color service', () => {
//         spyOn(component, 'swapColors').and.callThrough();
//         component.swapColors();
//         expect(component.swapColors).toHaveBeenCalled();
//         expect(component['colorService'].swapPrimaryAndSecondaryColors).toHaveBeenCalled();
//     });

//     it('#getSelectedColor() should call getPrimaryColor() from the color service if isPrimarySelected is true', () => {
//         component.isPrimarySelected = true;
//         spyOn(component, 'getSelectedColor').and.callThrough();
//         component.getSelectedColor();
//         expect(component.getSelectedColor).toHaveBeenCalled();
//         expect(component['colorService'].getPrimaryColor).toHaveBeenCalled();
//     });

//     it('#getSelectedColor() should call getSecondaryColor() from the color service if isPrimarySelected is false', () => {
//         component.isPrimarySelected = false;
//         spyOn(component, 'getSelectedColor').and.callThrough();
//         component.getSelectedColor();
//         expect(component.getSelectedColor).toHaveBeenCalled();
//         expect(component['colorService'].getSecondaryColor).toHaveBeenCalled();
//     });
// });
