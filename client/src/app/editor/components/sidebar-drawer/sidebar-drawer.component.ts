import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import Regexes from '@app/constants/regexes';
import { CommandService } from '@app/drawing/services/command.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    // Make enums available to template
    ToolSetting = ToolSetting;
    BrushTexture = BrushTexture;
    ShapeType = ShapeType;

    readonly minimumLineWidth = 1;
    readonly maximumLineWidth = 500;
    readonly minimumJunctionDiameter = 5;
    readonly maximumJunctionDiameter = 500;
    readonly minimumSprayDiameter = 20;
    readonly maximumSprayDiameter = 350;
    readonly minimumSprayRate = 10;
    readonly maximumSprayRate = 100;
    readonly minimumShapeBorderWidth = 1;
    readonly maximumShapeBorderWidth = 100;
    readonly minimumPolygonSideCount = 3;
    readonly maximumPolygonSideCount = 12;
    readonly minimumEraserSize = 3;
    readonly maximumEraserSize = 25;

    @Output() undoClicked = new EventEmitter<void>();
    @Output() redoClicked = new EventEmitter<void>();

    lineWidthChangedSubscription: Subscription;
    junctionDiameterChangedSubscription: Subscription;
    sprayDiameterChangedSubscription: Subscription;
    sprayRateChangedSubscription: Subscription;
    shapeBorderWidthChangedSubscription: Subscription;
    polygonSideCountChangedSubscription: Subscription;
    eraserSizeChangedSubscription: Subscription;

    lineWidthFormControl = new FormControl(ToolDefaults.defaultLineWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.max(this.maximumLineWidth),
        Validators.min(this.minimumLineWidth),
    ]);

    junctionDiameterFormControl = new FormControl(
        { value: ToolDefaults.defaultJunctionSettings.diameter, disabled: !ToolDefaults.defaultJunctionSettings.isEnabled },
        [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(this.minimumJunctionDiameter),
            Validators.max(this.maximumJunctionDiameter),
        ]
    );

    sprayDiameterFormControl = new FormControl(ToolDefaults.defaultSprayDiameter, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumSprayDiameter),
        Validators.max(this.maximumSprayDiameter),
    ]);

    sprayRateFormControl = new FormControl(ToolDefaults.defaultSprayRate, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumSprayRate),
        Validators.max(this.maximumSprayRate),
    ]);

    polygonSideCountFormControl = new FormControl(ToolDefaults.defaultPolygonSideCount, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumPolygonSideCount),
        Validators.max(this.maximumPolygonSideCount),
    ]);

    shapeBorderWidthFormControl = new FormControl(ToolDefaults.defaultShapeBorderWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumShapeBorderWidth),
        Validators.max(this.maximumShapeBorderWidth),
    ]);

    eraserSizeFormControl = new FormControl(ToolDefaults.defaultEraserSize, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumEraserSize),
        Validators.max(this.maximumEraserSize),
    ]);

    constructor(private currentToolService: CurrentToolService, private commandService: CommandService) {}

    ngOnInit(): void {
        this.lineWidthChangedSubscription = this.lineWidthFormControl.valueChanges.subscribe(() => {
            if (this.lineWidthFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.LineWidth, this.lineWidthFormControl.value);
            }
        });

        this.junctionDiameterChangedSubscription = this.junctionDiameterFormControl.valueChanges.subscribe(() => {
            if (this.junctionDiameterFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.JunctionSettings, {
                    isEnabled: (this.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).isEnabled,
                    diameter: this.junctionDiameterFormControl.value,
                } as JunctionSettings);
            }
        });

        this.sprayDiameterChangedSubscription = this.sprayDiameterFormControl.valueChanges.subscribe(() => {
            if (this.sprayDiameterFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.SprayDiameter, this.sprayDiameterFormControl.value);
            }
        });

        this.sprayRateChangedSubscription = this.sprayRateFormControl.valueChanges.subscribe(() => {
            if (this.sprayRateFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.SprayRate, this.sprayRateFormControl.value);
            }
        });

        this.shapeBorderWidthChangedSubscription = this.shapeBorderWidthFormControl.valueChanges.subscribe(() => {
            if (this.shapeBorderWidthFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.ShapeBorderWidth, this.shapeBorderWidthFormControl.value);
            }
        });

        this.polygonSideCountChangedSubscription = this.polygonSideCountFormControl.valueChanges.subscribe(() => {
            if (this.polygonSideCountFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.PolygonSideCount, this.polygonSideCountFormControl.value);
            }
        });

        this.eraserSizeChangedSubscription = this.eraserSizeFormControl.valueChanges.subscribe(() => {
            if (this.eraserSizeFormControl.valid) {
                this.currentToolService.setSetting(ToolSetting.EraserSize, this.eraserSizeFormControl.value);
            }
        });
    }

    ngOnDestroy(): void {
        this.lineWidthChangedSubscription.unsubscribe();
        this.junctionDiameterChangedSubscription.unsubscribe();
        this.sprayDiameterChangedSubscription.unsubscribe();
        this.sprayRateChangedSubscription.unsubscribe();
        this.shapeBorderWidthChangedSubscription.unsubscribe();
        this.polygonSideCountChangedSubscription.unsubscribe();
        this.eraserSizeChangedSubscription.unsubscribe();
    }

    getSetting(setting: ToolSetting): number | BrushTexture | JunctionSettings | ShapeType {
        return this.currentToolService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | BrushTexture | JunctionSettings | ShapeType): void {
        if (setting === ToolSetting.JunctionSettings) {
            (value as JunctionSettings).isEnabled ? this.junctionDiameterFormControl.enable() : this.junctionDiameterFormControl.disable();
        }
        this.currentToolService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.currentToolService.hasSetting(setting);
    }

    asJunctionSettings(value: number | JunctionSettings): JunctionSettings {
        return value as JunctionSettings;
    }

    getLineWidthErrorMessage(): string {
        return this.getErrorMessage(this.lineWidthFormControl);
    }

    getJunctionDiameterErrorMessage(): string {
        return this.getErrorMessage(this.junctionDiameterFormControl);
    }

    getSprayDiameterErrorMessage(): string {
        return this.getErrorMessage(this.sprayDiameterFormControl);
    }

    getSprayRateErrorMessage(): string {
        return this.getErrorMessage(this.sprayRateFormControl);
    }

    getShapeBorderWidthErrorMessage(): string {
        return this.getErrorMessage(this.shapeBorderWidthFormControl);
    }

    getPolygonSideCountErrorMessage(): string {
        return this.getErrorMessage(this.polygonSideCountFormControl);
    }

    getEraserSizeErrorMessage(): string {
        return this.getErrorMessage(this.eraserSizeFormControl);
    }

    get toolName(): string {
        return this.currentToolService.getToolName();
    }

    @Input()
    set selectedButtonIndex(index: number) {
        if (this.currentToolService.hasSetting(ToolSetting.LineWidth)) {
            this.lineWidthFormControl.setValue(this.currentToolService.getSetting(ToolSetting.LineWidth));
        }
        if (this.currentToolService.hasSetting(ToolSetting.JunctionSettings)) {
            const junctionDiameter = (this.currentToolService.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).diameter;
            this.junctionDiameterFormControl.setValue(junctionDiameter);
        }
        if (this.currentToolService.hasSetting(ToolSetting.SprayDiameter)) {
            this.sprayDiameterFormControl.setValue(this.currentToolService.getSetting(ToolSetting.SprayDiameter));
        }
        if (this.currentToolService.hasSetting(ToolSetting.SprayRate)) {
            this.sprayRateFormControl.setValue(this.currentToolService.getSetting(ToolSetting.SprayRate));
        }
        if (this.currentToolService.hasSetting(ToolSetting.ShapeBorderWidth)) {
            this.shapeBorderWidthFormControl.setValue(this.currentToolService.getSetting(ToolSetting.ShapeBorderWidth));
        }
        if (this.currentToolService.hasSetting(ToolSetting.PolygonSideCount)) {
            this.polygonSideCountFormControl.setValue(this.currentToolService.getSetting(ToolSetting.PolygonSideCount));
        }
        if (this.currentToolService.hasSetting(ToolSetting.EraserSize)) {
            this.eraserSizeFormControl.setValue(this.currentToolService.getSetting(ToolSetting.EraserSize));
        }
    }

    get isUndoAvailable(): boolean {
        return this.commandService.hasUndoCommands();
    }

    get isRedoAvailable(): boolean {
        return this.commandService.hasRedoCommands();
    }

    private getErrorMessage(formControl: AbstractControl): string {
        return formControl.hasError('required')
            ? 'Entrez une taille'
            : formControl.hasError('pattern')
            ? 'Nombre entier invalide'
            : formControl.hasError('min')
            ? 'Valeur trop petite'
            : formControl.hasError('max')
            ? 'Valeur trop grande'
            : '';
    }
}
