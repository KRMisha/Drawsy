import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HistoryService } from '@app/drawing/services/history.service';
import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { ToolSettings } from '@app/tools/classes/tool-settings';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Tool } from '@app/tools/services/tool';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-non-null-assertion
// tslint:disable: max-line-length
// tslint:disable: max-file-line-count

describe('SidebarDrawerComponent', () => {
    let component: SidebarDrawerComponent;
    let fixture: ComponentFixture<SidebarDrawerComponent>;

    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let lineWidthFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let junctionEnabledFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let junctionDiameterFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let sprayDiameterFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let sprayRateFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let polygonSideCountFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let shapeBorderWidthFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let fillDeviationFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let eraserSizeFormControlSpyObj: jasmine.SpyObj<FormControl>;

    let undoShortcutSubject: Subject<void>;
    let redoShortcutSubject: Subject<void>;
    let lineWidthChangedSubject: Subject<any>;
    let junctionEnabledChangedSubject: Subject<any>;
    let junctionDiameterChangedSubject: Subject<any>;
    let sprayDiameterChangedSubject: Subject<any>;
    let sprayRateChangedSubject: Subject<any>;
    let shapeBorderWidthChangedSubject: Subject<any>;
    let polygonSideCountChangedSubject: Subject<any>;
    let fillDeviationChangedSubject: Subject<any>;
    let eraserSizeChangedSubject: Subject<any>;

    const toolName = 'Pinceau';
    const toolShortcut = 'W';
    const toolIcon = 'brush';
    const toolSettings = {} as ToolSettings;
    const initialFormControlValue = 10;

    beforeEach(async(() => {
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', ['update'], {
            currentTool: { info: { name: toolName, shortcut: toolShortcut, icon: toolIcon }, settings: toolSettings } as Tool,
        });
        undoShortcutSubject = new Subject<void>();
        redoShortcutSubject = new Subject<void>();
        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            undoShortcut$: undoShortcutSubject,
            redoShortcut$: redoShortcutSubject,
        });
        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['undo', 'redo', 'canUndo', 'canRedo']);

        lineWidthChangedSubject = new Subject<any>();
        junctionEnabledChangedSubject = new Subject<any>();
        junctionDiameterChangedSubject = new Subject<any>();
        sprayDiameterChangedSubject = new Subject<any>();
        sprayRateChangedSubject = new Subject<any>();
        shapeBorderWidthChangedSubject = new Subject<any>();
        polygonSideCountChangedSubject = new Subject<any>();
        fillDeviationChangedSubject = new Subject<any>();
        eraserSizeChangedSubject = new Subject<any>();

        lineWidthFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: lineWidthChangedSubject,
            value: initialFormControlValue,
        });
        junctionEnabledFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            value: true,
            valueChanges: junctionEnabledChangedSubject,
        });
        junctionDiameterFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset', 'enable', 'disable'], {
            valid: true,
            valueChanges: junctionDiameterChangedSubject,
            value: initialFormControlValue,
        });
        sprayDiameterFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: sprayDiameterChangedSubject,
            value: initialFormControlValue,
        });
        sprayRateFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: sprayRateChangedSubject,
            value: initialFormControlValue,
        });
        shapeBorderWidthFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: shapeBorderWidthChangedSubject,
            value: initialFormControlValue,
        });
        polygonSideCountFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: polygonSideCountChangedSubject,
            value: initialFormControlValue,
        });
        fillDeviationFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: fillDeviationChangedSubject,
            value: initialFormControlValue,
        });
        eraserSizeFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: true,
            valueChanges: eraserSizeChangedSubject,
            value: initialFormControlValue,
        });

        TestBed.configureTestingModule({
            declarations: [SidebarDrawerComponent],
            imports: [BrowserAnimationsModule, MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
            providers: [
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
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

    it("#ngOnInit should subscribe to the formControls' valueChanges", async(() => {
        component.lineWidthFormControl = lineWidthFormControlSpyObj;
        component.junctionEnabledFormControl = junctionEnabledFormControlSpyObj;
        component.junctionDiameterFormControl = junctionDiameterFormControlSpyObj;
        component.sprayDiameterFormControl = sprayDiameterFormControlSpyObj;
        component.sprayRateFormControl = sprayRateFormControlSpyObj;
        component.polygonSideCountFormControl = polygonSideCountFormControlSpyObj;
        component.shapeBorderWidthFormControl = shapeBorderWidthFormControlSpyObj;
        component.fillDeviationFormControl = fillDeviationFormControlSpyObj;
        component.eraserSizeFormControl = eraserSizeFormControlSpyObj;

        const lineWidthChangedSpy = spyOn(lineWidthChangedSubject, 'subscribe').and.callThrough();
        const junctionEnabledChangedSpy = spyOn(junctionEnabledChangedSubject, 'subscribe').and.callThrough();
        const junctionDiameterChangedSpy = spyOn(junctionDiameterChangedSubject, 'subscribe').and.callThrough();
        const sprayDiameterChangedSpy = spyOn(sprayDiameterChangedSubject, 'subscribe').and.callThrough();
        const sprayRateChangedSpy = spyOn(sprayRateChangedSubject, 'subscribe').and.callThrough();
        const shapeBorderWidthChangedSpy = spyOn(shapeBorderWidthChangedSubject, 'subscribe').and.callThrough();
        const polygonSideCountChangedSpy = spyOn(polygonSideCountChangedSubject, 'subscribe').and.callThrough();
        const fillDeviationChangedSpy = spyOn(fillDeviationChangedSubject, 'subscribe').and.callThrough();
        const eraserSizeChangedSpy = spyOn(eraserSizeChangedSubject, 'subscribe').and.callThrough();

        component.ngOnInit();

        expect(lineWidthChangedSpy).toHaveBeenCalled();
        expect(junctionEnabledChangedSpy).toHaveBeenCalled();
        expect(junctionDiameterChangedSpy).toHaveBeenCalled();
        expect(sprayDiameterChangedSpy).toHaveBeenCalled();
        expect(sprayRateChangedSpy).toHaveBeenCalled();
        expect(shapeBorderWidthChangedSpy).toHaveBeenCalled();
        expect(polygonSideCountChangedSpy).toHaveBeenCalled();
        expect(fillDeviationChangedSpy).toHaveBeenCalled();
        expect(eraserSizeChangedSpy).toHaveBeenCalled();
    }));

    it("#ngOnInit should subscribe to shortcutService's undoShortcut and redoShortcut", async(() => {
        const undoShortcutSpy = spyOn(undoShortcutSubject, 'subscribe').and.callThrough();
        const redoShortcutSpy = spyOn(redoShortcutSubject, 'subscribe').and.callThrough();
        component.ngOnInit();
        expect(undoShortcutSpy).toHaveBeenCalled();
        expect(redoShortcutSpy).toHaveBeenCalled();
    }));

    it("lineWidthSubscription should change the lineWidth of the currentTool's settings if the formControl is valid", async(() => {
        component['lineWidthFormControl'] = lineWidthFormControlSpyObj;
        const settingsMock = { lineWidth: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        lineWidthChangedSubject.next();
        expect(settingsMock.lineWidth).toEqual(initialFormControlValue);
    }));

    it("lineWidthSubscription should not change the lineWidth of the currentTool's settings if the formControl is invalid", async(() => {
        lineWidthFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: lineWidthChangedSubject,
            value: initialFormControlValue,
        });
        component['lineWidthFormControl'] = lineWidthFormControlSpyObj;
        const settingsMock = { lineWidth: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        lineWidthChangedSubject.next();
        expect(settingsMock.lineWidth).toEqual(0);
    }));

    it("junctionEnabledSubscription should change the currentTool's isEnabled setting and enable the junctionDiameter form control if its value is true", async(() => {
        component['junctionEnabledFormControl'] = junctionEnabledFormControlSpyObj;
        component['junctionDiameterFormControl'] = junctionDiameterFormControlSpyObj;
        const settingsMock = { junctionSettings: { isEnabled: false } as JunctionSettings } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        junctionEnabledChangedSubject.next();
        expect(settingsMock.junctionSettings?.isEnabled).toEqual(true);
        expect(junctionDiameterFormControlSpyObj.enable).toHaveBeenCalled();
    }));

    it("junctionEnabledSubscription should change the currentTool's isEnabled setting and disable the junctionDiameter form control if its value is false", async(() => {
        junctionEnabledFormControlSpyObj = jasmine.createSpyObj('FormControl', [], {
            value: false,
            valueChanges: junctionEnabledChangedSubject,
        });
        component['junctionEnabledFormControl'] = junctionEnabledFormControlSpyObj;
        component['junctionDiameterFormControl'] = junctionDiameterFormControlSpyObj;
        const settingsMock = { junctionSettings: { isEnabled: true } as JunctionSettings } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        junctionEnabledChangedSubject.next();
        expect(settingsMock.junctionSettings?.isEnabled).toEqual(false);
        expect(junctionDiameterFormControlSpyObj.disable).toHaveBeenCalled();
    }));

    it("junctionDiameterSubscription should change the diameter of the currentTool's settings if the formControl is valid", async(() => {
        component['junctionDiameterFormControl'] = junctionDiameterFormControlSpyObj;
        const settingsMock = { junctionSettings: { diameter: 0 } as JunctionSettings } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        junctionDiameterChangedSubject.next();
        expect(settingsMock.junctionSettings!.diameter).toEqual(initialFormControlValue);
    }));

    it("junctionDiameterSubscription should not change the diameter of the currentTool's settings if the formControl is invalid", async(() => {
        junctionDiameterFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset', 'enable', 'disable'], {
            valid: false,
            valueChanges: junctionDiameterChangedSubject,
            value: initialFormControlValue,
        });
        component['junctionDiameterFormControl'] = junctionDiameterFormControlSpyObj;
        const settingsMock = { junctionSettings: { diameter: 0 } as JunctionSettings } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        junctionDiameterChangedSubject.next();
        expect(settingsMock.junctionSettings!.diameter).toEqual(0);
    }));

    it("sprayDiameterSubscription should change the sprayDiameter of the currentTool's settings if the formControl is valid", async(() => {
        component['sprayDiameterFormControl'] = sprayDiameterFormControlSpyObj;
        const settingsMock = { sprayDiameter: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        sprayDiameterChangedSubject.next();
        expect(settingsMock.sprayDiameter).toEqual(initialFormControlValue);
    }));

    it("sprayDiameterSubscription should not change the sprayDiameter of the currentTool's settings if the formControl is invalid", async(() => {
        sprayDiameterFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: sprayDiameterChangedSubject,
            value: initialFormControlValue,
        });
        component['sprayDiameterFormControl'] = sprayDiameterFormControlSpyObj;
        const settingsMock = { sprayDiameter: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        sprayDiameterChangedSubject.next();
        expect(settingsMock.sprayDiameter).toEqual(0);
    }));

    it("sprayRateSubscription should change the sprayRate of the currentTool's settings if the formControl is valid", async(() => {
        component['sprayRateFormControl'] = sprayRateFormControlSpyObj;
        const settingsMock = { sprayRate: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        sprayRateChangedSubject.next();
        expect(settingsMock.sprayRate).toEqual(initialFormControlValue);
    }));

    it("sprayRateSubscription should not change the sprayRate of the currentTool's settings if the formControl is invalid", async(() => {
        sprayRateFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: sprayRateChangedSubject,
            value: initialFormControlValue,
        });
        component['sprayRateFormControl'] = sprayRateFormControlSpyObj;
        const settingsMock = { sprayRate: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        sprayRateChangedSubject.next();
        expect(settingsMock.sprayRate).toEqual(0);
    }));

    it("shapeBorderWidthSubscription should change the shapeBorderWidth of the currentTool's settings if the formControl is valid", async(() => {
        component['shapeBorderWidthFormControl'] = shapeBorderWidthFormControlSpyObj;
        const settingsMock = { shapeBorderWidth: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        shapeBorderWidthChangedSubject.next();
        expect(settingsMock.shapeBorderWidth).toEqual(initialFormControlValue);
    }));

    it("shapeBorderWidthSubscription should not change the shapeBorderWidth of the currentTool's settings if the formControl is invalid", async(() => {
        shapeBorderWidthFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: shapeBorderWidthChangedSubject,
            value: initialFormControlValue,
        });
        component['shapeBorderWidthFormControl'] = shapeBorderWidthFormControlSpyObj;
        const settingsMock = { shapeBorderWidth: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        shapeBorderWidthChangedSubject.next();
        expect(settingsMock.shapeBorderWidth).toEqual(0);
    }));

    it("polygonSideCountSubscription should change the polygonSideCount of the currentTool's settings if the formControl is valid", async(() => {
        component['polygonSideCountFormControl'] = polygonSideCountFormControlSpyObj;
        const settingsMock = { polygonSideCount: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        polygonSideCountChangedSubject.next();
        expect(settingsMock.polygonSideCount).toEqual(initialFormControlValue);
    }));

    it("polygonSideCountSubscription should not change the polygonSideCount of the currentTool's settings if the formControl is invalid", async(() => {
        polygonSideCountFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: polygonSideCountChangedSubject,
            value: initialFormControlValue,
        });
        component['polygonSideCountFormControl'] = polygonSideCountFormControlSpyObj;
        const settingsMock = { polygonSideCount: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        polygonSideCountChangedSubject.next();
        expect(settingsMock.polygonSideCount).toEqual(0);
    }));

    it("fillDeviationSubscription should change the fillDeviation of the currentTool's settings if the formControl is valid", async(() => {
        component['fillDeviationFormControl'] = fillDeviationFormControlSpyObj;
        const settingsMock = { fillDeviation: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        fillDeviationChangedSubject.next();
        expect(settingsMock.fillDeviation).toEqual(initialFormControlValue);
    }));

    it("fillDeviationSubscription should not change the fillDeviation of the currentTool's settings if the formControl is invalid", async(() => {
        fillDeviationFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: fillDeviationChangedSubject,
            value: initialFormControlValue,
        });
        component['fillDeviationFormControl'] = fillDeviationFormControlSpyObj;
        const settingsMock = { fillDeviation: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        fillDeviationChangedSubject.next();
        expect(settingsMock.fillDeviation).toEqual(0);
    }));

    it("eraserSizeSubscription should change the eraserSize of the currentTool's settings if the formControl is valid", async(() => {
        component['eraserSizeFormControl'] = eraserSizeFormControlSpyObj;
        const settingsMock = { eraserSize: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        eraserSizeChangedSubject.next();
        expect(settingsMock.eraserSize).toEqual(initialFormControlValue);
    }));

    it("eraserSizeSubscription should not change the eraserSize of the currentTool's settings if the formControl is invalid", async(() => {
        eraserSizeFormControlSpyObj = jasmine.createSpyObj('FormControl', ['reset'], {
            valid: false,
            valueChanges: eraserSizeChangedSubject,
            value: initialFormControlValue,
        });
        component['eraserSizeFormControl'] = eraserSizeFormControlSpyObj;
        const settingsMock = { eraserSize: 0 } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;
        component.ngOnInit();
        eraserSizeChangedSubject.next();
        expect(settingsMock.eraserSize).toEqual(0);
    }));

    it('undoShortcutSubscription should call #undoCommand', async(() => {
        const undoCommandSpy = spyOn(component, 'undoCommand');
        undoShortcutSubject.next();
        expect(undoCommandSpy).toHaveBeenCalled();
    }));

    it('redoShortcutSubscription should call #redoCommand', async(() => {
        const redoCommandSpy = spyOn(component, 'redoCommand');
        redoShortcutSubject.next();
        expect(redoCommandSpy).toHaveBeenCalled();
    }));

    it("#ngOnDestroy should unsubscribe from the formControls' valueChanges", async(() => {
        const lineWidthSubscriptionSpy = spyOn(component['lineWidthChangedSubscription'], 'unsubscribe');
        const junctionEnabledSubscriptionSpy = spyOn(component['junctionEnabledChangedSubscription'], 'unsubscribe');
        const junctionDiameterSubscriptionSpy = spyOn(component['junctionDiameterChangedSubscription'], 'unsubscribe');
        const sprayDiameterSubscriptionSpy = spyOn(component['sprayDiameterChangedSubscription'], 'unsubscribe');
        const sprayRateSubscriptionSpy = spyOn(component['sprayRateChangedSubscription'], 'unsubscribe');
        const shapeBorderWidthSubscriptionSpy = spyOn(component['shapeBorderWidthChangedSubscription'], 'unsubscribe');
        const polygonSideCountSubscriptionSpy = spyOn(component['polygonSideCountChangedSubscription'], 'unsubscribe');
        const fillDeviationSubscriptionSpy = spyOn(component['fillDeviationChangedSubscription'], 'unsubscribe');
        const eraserSizeSubscriptionSpy = spyOn(component['eraserSizeChangedSubscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(lineWidthSubscriptionSpy).toHaveBeenCalled();
        expect(junctionEnabledSubscriptionSpy).toHaveBeenCalled();
        expect(junctionDiameterSubscriptionSpy).toHaveBeenCalled();
        expect(sprayDiameterSubscriptionSpy).toHaveBeenCalled();
        expect(sprayRateSubscriptionSpy).toHaveBeenCalled();
        expect(shapeBorderWidthSubscriptionSpy).toHaveBeenCalled();
        expect(polygonSideCountSubscriptionSpy).toHaveBeenCalled();
        expect(fillDeviationSubscriptionSpy).toHaveBeenCalled();
        expect(eraserSizeSubscriptionSpy).toHaveBeenCalled();
    }));

    it("#ngOnDestroy should unsubscribe from shortcutService's undoShortcut and redoShortcut", async(() => {
        const undoShortcutSubscriptionSpy = spyOn(component['undoShortcutSubscription'], 'unsubscribe');
        const redoShortcutSubscriptionSpy = spyOn(component['redoShortcutSubscription'], 'unsubscribe');

        component.ngOnDestroy();

        expect(undoShortcutSubscriptionSpy).toHaveBeenCalled();
        expect(redoShortcutSubscriptionSpy).toHaveBeenCalled();
    }));

    it("#resetCurrentControls should reset all the formControls for which the currentTool's setting is not undefined", () => {
        component.lineWidthFormControl = lineWidthFormControlSpyObj;
        component.junctionEnabledFormControl = junctionEnabledFormControlSpyObj;
        component.junctionDiameterFormControl = junctionDiameterFormControlSpyObj;
        component.sprayDiameterFormControl = sprayDiameterFormControlSpyObj;
        component.sprayRateFormControl = sprayRateFormControlSpyObj;
        component.polygonSideCountFormControl = polygonSideCountFormControlSpyObj;
        component.shapeBorderWidthFormControl = shapeBorderWidthFormControlSpyObj;
        component.fillDeviationFormControl = fillDeviationFormControlSpyObj;
        component.eraserSizeFormControl = eraserSizeFormControlSpyObj;

        const junctionSettingsMock = {} as JunctionSettings;
        const settingsMock = {
            lineWidth: 0,
            junctionSettings: junctionSettingsMock,
            sprayDiameter: 0,
            sprayRate: 0,
            shapeBorderWidth: 0,
            polygonSideCount: 0,
            fillDeviation: 0,
            eraserSize: 0,
        } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });
        component['currentToolService'] = currentToolServiceSpyObj;

        component.resetCurrentControls();

        expect(lineWidthFormControlSpyObj.reset).toHaveBeenCalled();
        expect(junctionEnabledFormControlSpyObj.reset).toHaveBeenCalled();
        expect(junctionDiameterFormControlSpyObj.reset).toHaveBeenCalled();
        expect(sprayDiameterFormControlSpyObj.reset).toHaveBeenCalled();
        expect(sprayRateFormControlSpyObj.reset).toHaveBeenCalled();
        expect(shapeBorderWidthFormControlSpyObj.reset).toHaveBeenCalled();
        expect(polygonSideCountFormControlSpyObj.reset).toHaveBeenCalled();
        expect(fillDeviationFormControlSpyObj.reset).toHaveBeenCalled();
        expect(eraserSizeFormControlSpyObj.reset).toHaveBeenCalled();
    });

    it("#resetCurrentControls should not reset formControls for which the currentTool's setting is undefined", () => {
        component.lineWidthFormControl = lineWidthFormControlSpyObj;
        component.junctionEnabledFormControl = junctionEnabledFormControlSpyObj;
        component.junctionDiameterFormControl = junctionDiameterFormControlSpyObj;
        component.sprayDiameterFormControl = sprayDiameterFormControlSpyObj;
        component.sprayRateFormControl = sprayRateFormControlSpyObj;
        component.polygonSideCountFormControl = polygonSideCountFormControlSpyObj;
        component.shapeBorderWidthFormControl = shapeBorderWidthFormControlSpyObj;
        component.fillDeviationFormControl = shapeBorderWidthFormControlSpyObj;
        component.eraserSizeFormControl = eraserSizeFormControlSpyObj;

        const settingsMock = {
            lineWidth: undefined,
            junctionSettings: undefined,
            sprayDiameter: undefined,
            sprayRate: undefined,
            shapeBorderWidth: undefined,
            polygonSideCount: undefined,
            fillDeviation: undefined,
            eraserSize: undefined,
        } as ToolSettings;
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', [], {
            currentTool: {
                settings: settingsMock,
            },
        });

        component.resetCurrentControls();

        expect(lineWidthFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(junctionEnabledFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(junctionDiameterFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(sprayDiameterFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(sprayRateFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(shapeBorderWidthFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(polygonSideCountFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(fillDeviationFormControlSpyObj.reset).not.toHaveBeenCalled();
        expect(eraserSizeFormControlSpyObj.reset).not.toHaveBeenCalled();
    });

    it('#undoCommand should forward the call to historyService and currentToolService', () => {
        component.undoCommand();
        expect(historyServiceSpyObj.undo).toHaveBeenCalled();
        expect(currentToolServiceSpyObj.update).toHaveBeenCalled();
    });

    it('#redoCommand should forward the call to historyService and currentToolService', () => {
        component.redoCommand();
        expect(historyServiceSpyObj.redo).toHaveBeenCalled();
        expect(currentToolServiceSpyObj.update).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage(lineWidthFormControlSpyObj);
        expect(errorMessageSpy).toHaveBeenCalledWith(lineWidthFormControlSpyObj, 'Entiers');
    });

    it("#getProperty should return the setting's value if it exists", () => {
        const object = { settings: {} as ToolSettings };
        const expectedValue = 12;
        object.settings.eraserSize = expectedValue;
        const actualValue = component.getProperty(object.settings, ToolSetting.EraserSize);
        expect(actualValue).toEqual(expectedValue);
    });

    it('#getProperty should return undefined if the setting does not exist', () => {
        const object = { settings: {} as ToolSettings };
        const actualValue = component.getProperty(object.settings, ToolSetting.EraserSize);
        expect(actualValue).toBeUndefined();
    });
});
