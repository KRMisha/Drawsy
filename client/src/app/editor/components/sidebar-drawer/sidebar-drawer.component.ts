import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommandService } from '@app/drawing/services/command.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumBorderWidth = 100;
const maximumSpraySpeed = 100;
const maximumSprayRadius = 100;
const minimumEraserSize = 3;
const maximumEraserSize = 50;
const maximumjunctionDiameter = 500;
const maximumPolygonSideCount = 12;
const minimumPolygonSideCount = 3;

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    @Output() undoClicked = new EventEmitter<void>();
    @Output() redoClicked = new EventEmitter<void>();

    // Make enums available to template
    ToolSetting = ToolSetting;
    BrushTexture = BrushTexture;
    ShapeType = ShapeType;

    lineWidthChangedSubscription: Subscription;
    borderWidthChangedSubscription: Subscription;
    eraserSizeChangedSubscription: Subscription;
    junctionDiameterChangedSubscription: Subscription;
    polygonSideCountChangedSubscription: Subscription;
    spraySpeedChangedSubscription: Subscription;
    sprayRadiusChangedSubscription: Subscription;

    lineWidthGroup = new FormGroup({
        lineWidth: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumSize),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    borderWidthGroup = new FormGroup({
        borderWidth: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumBorderWidth),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    eraserSizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(minimumEraserSize),
                Validators.max(maximumEraserSize),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    junctionDiameterGroup = new FormGroup({
        junctionDiameter: new FormControl(
            { value: 0, disabled: true },
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumjunctionDiameter),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    polygonSideCountGroup = new FormGroup({
        polygonSideCount: new FormControl(
            { value: 0, disabled: false },
            Validators.compose([
                Validators.required,
                Validators.min(minimumPolygonSideCount),
                Validators.max(maximumPolygonSideCount),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    spraySpeedGroup = new FormGroup({
        spraySpeed: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumSpraySpeed),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    sprayRadiusGroup = new FormGroup({
        sprayRadius: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumSprayRadius),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    @Input()
    set selectedButtonIndex(index: number) {
        if (this.currentToolService.hasSetting(ToolSetting.LineWidth)) {
            this.lineWidthGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.LineWidth));
        }
        if (this.currentToolService.hasSetting(ToolSetting.ShapeBorderWidth)) {
            this.borderWidthGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.ShapeBorderWidth));
        }
        if (this.currentToolService.hasSetting(ToolSetting.EraserSize)) {
            this.eraserSizeGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.EraserSize));
        }
        if (this.currentToolService.hasSetting(ToolSetting.JunctionSettings)) {
            const junctionDiameter = (this.currentToolService.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).diameter;
            this.junctionDiameterGroup.controls.junctionDiameter.setValue(junctionDiameter);
        }
        if (this.currentToolService.hasSetting(ToolSetting.PolygonSideCount)) {
            this.polygonSideCountGroup.controls.polygonSideCount.setValue(this.currentToolService.getSetting(ToolSetting.PolygonSideCount));
        }
        if (this.currentToolService.hasSetting(ToolSetting.SpraySpeed)) {
            this.spraySpeedGroup.controls.spraySpeed.setValue(this.currentToolService.getSetting(ToolSetting.SpraySpeed));
        }
        if (this.currentToolService.hasSetting(ToolSetting.SprayRadius)) {
            this.sprayRadiusGroup.controls.sprayRadius.setValue(this.currentToolService.getSetting(ToolSetting.SprayRadius));
        }
    }

    constructor(private currentToolService: CurrentToolService, private commandService: CommandService) {}

    ngOnInit(): void {
        this.lineWidthGroup.controls.size.setValue(ToolDefaults.defaultSize);
        this.junctionDiameterGroup.controls.junctionDiameter.setValue(ToolDefaults.defaultJunctionDiameter);

        this.lineWidthChangedSubscription = this.lineWidthGroup.controls.size.valueChanges.subscribe(() => {
            if (this.lineWidthGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.LineWidth, this.lineWidthGroup.controls.size.value);
            }
        });

        this.borderWidthChangedSubscription = this.borderWidthGroup.controls.size.valueChanges.subscribe(() => {
            if (this.borderWidthGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.ShapeBorderWidth, this.borderWidthGroup.controls.size.value);
            }
        });

        this.eraserSizeChangedSubscription = this.eraserSizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.eraserSizeGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.EraserSize, this.eraserSizeGroup.controls.size.value);
            }
        });

        this.junctionDiameterChangedSubscription = this.junctionDiameterGroup.controls.junctionDiameter.valueChanges.subscribe(() => {
            if (this.junctionDiameterGroup.controls.junctionDiameter.valid) {
                this.currentToolService.setSetting(ToolSetting.JunctionSettings, {
                    isEnabled: (this.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).isEnabled,
                    diameter: this.junctionDiameterGroup.controls.junctionDiameter.value,
                } as JunctionSettings);
            }
        });

        this.polygonSideCountChangedSubscription = this.polygonSideCountGroup.controls.polygonSideCount.valueChanges.subscribe(() => {
            if (this.polygonSideCountGroup.controls.polygonSideCount.valid) {
                this.currentToolService.setSetting(
                    ToolSetting.PolygonSideCount,
                    this.polygonSideCountGroup.controls.polygonSideCount.value
                );
            }
        });

        this.spraySpeedChangedSubscription = this.spraySpeedGroup.controls.spraySpeed.valueChanges.subscribe(() => {
            if (this.spraySpeedGroup.controls.spraySpeed.valid) {
                this.currentToolService.setSetting(ToolSetting.SpraySpeed, this.spraySpeedGroup.controls.spraySpeed.value);
            }
        });

        this.sprayRadiusChangedSubscription = this.sprayRadiusGroup.controls.sprayRadius.valueChanges.subscribe(() => {
            if (this.sprayRadiusGroup.controls.sprayRadius.valid) {
                this.currentToolService.setSetting(ToolSetting.SprayRadius, this.sprayRadiusGroup.controls.sprayRadius.value);
            }
        });
    }

    ngOnDestroy(): void {
        this.lineWidthChangedSubscription.unsubscribe();
        this.junctionDiameterChangedSubscription.unsubscribe();
        this.borderWidthChangedSubscription.unsubscribe();
        this.eraserSizeChangedSubscription.unsubscribe();
        this.polygonSideCountChangedSubscription.unsubscribe();
        this.spraySpeedChangedSubscription.unsubscribe();
        this.sprayRadiusChangedSubscription.unsubscribe();
    }

    getToolName(): string {
        return this.currentToolService.getToolName();
    }

    getSetting(setting: ToolSetting): number | JunctionSettings | ShapeType | BrushTexture {
        return this.currentToolService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | JunctionSettings | ShapeType | BrushTexture): void {
        if (setting === ToolSetting.JunctionSettings) {
            if ((value as JunctionSettings).isEnabled) {
                this.junctionDiameterGroup.controls.junctionDiameter.enable();
            } else {
                this.junctionDiameterGroup.controls.junctionDiameter.disable();
            }
        }
        this.currentToolService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.currentToolService.hasSetting(setting);
    }

    isUndoAvailable(): boolean {
        return this.commandService.hasUndoCommands();
    }

    isRedoAvailable(): boolean {
        return this.commandService.hasRedoCommands();
    }

    undoCommand(): void {
        this.undoClicked.emit();
    }

    redoCommand(): void {
        this.redoClicked.emit();
    }

    getLineWidthErrorMessage(): string {
        return this.getErrorMessage(this.lineWidthGroup.controls.lineWidth);
    }

    getBorderWidthErrorMessage(): string {
        return this.getErrorMessage(this.borderWidthGroup.controls.borderWidth);
    }

    getEraserSizeErrorMessage(): string {
        return this.getErrorMessage(this.eraserSizeGroup.controls.size);
    }

    getJunctionDiameterErrorMessage(): string {
        return this.getErrorMessage(this.junctionDiameterGroup.controls.junctionDiameter);
    }

    getPolygonSideCountErrorMessage(): string {
        return this.getErrorMessage(this.polygonSideCountGroup.controls.polygonSideCount);
    }

    getSpraySpeedErrorMessage(): string {
        return this.getErrorMessage(this.spraySpeedGroup.controls.spraySpeed);
    }

    getSprayRadiusErrorMessage(): string {
        return this.getErrorMessage(this.sprayRadiusGroup.controls.sprayRadius);
    }

    asJunctionSettings(value: number | JunctionSettings): JunctionSettings {
        return value as JunctionSettings;
    }

    private getErrorMessage(formControl: AbstractControl): string {
        return formControl.hasError('required')
            ? 'Entrez une taille'
            : formControl.hasError('min')
            ? 'Valeur trop petite'
            : formControl.hasError('max')
            ? 'Valeur trop grande'
            : formControl.hasError('pattern')
            ? 'Nombre entier invalide'
            : '';
    }
}
