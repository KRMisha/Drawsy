import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommandService } from '@app/drawing/services/command.service';
import { JunctionSettings } from '@app/tools/classes/junction-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { StrokeType, Texture, ToolSetting } from '@app/tools/enums/tool-settings.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

const integerRegexPattern = '^[0-9]*$';
const maximumSize = 500;
const maximumStrokeSize = 100;
const maximumSpraySpeed = 100;
const maximumSprayRadius = 100;
const minimumEraserSize = 3;
const maximumEraserSize = 50;
const maximumJunctionSize = 500;
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
    Texture = Texture;
    StrokeType = StrokeType;
    sizeSubscription: Subscription;
    strokeSizeSubscription: Subscription;
    eraserSizeSubscription: Subscription;
    junctionSizeSubscription: Subscription;
    polygonSideCountSubscription: Subscription;
    spraySpeedSubscription: Subscription;
    sprayRadiusSubscription: Subscription;

    sizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumSize),
                Validators.pattern(integerRegexPattern),
            ])
        ),
    });

    strokeSizeGroup = new FormGroup({
        size: new FormControl(
            0,
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumStrokeSize),
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

    junctionSizeGroup = new FormGroup({
        junctionSize: new FormControl(
            { value: 0, disabled: true },
            Validators.compose([
                Validators.required,
                Validators.min(1),
                Validators.max(maximumJunctionSize),
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
        if (this.currentToolService.hasSetting(ToolSetting.Size)) {
            this.sizeGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.Size));
        }
        if (this.currentToolService.hasSetting(ToolSetting.StrokeSize)) {
            this.strokeSizeGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.StrokeSize));
        }
        if (this.currentToolService.hasSetting(ToolSetting.EraserSize)) {
            this.eraserSizeGroup.controls.size.setValue(this.currentToolService.getSetting(ToolSetting.EraserSize));
        }
        if (this.currentToolService.hasSetting(ToolSetting.JunctionSettings)) {
            const junctionSize = (this.currentToolService.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).junctionSize;
            this.junctionSizeGroup.controls.junctionSize.setValue(junctionSize);
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
        this.sizeGroup.controls.size.setValue(ToolDefaults.defaultSize);
        this.junctionSizeGroup.controls.junctionSize.setValue(ToolDefaults.defaultJunctionSize);

        this.sizeSubscription = this.sizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.sizeGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.Size, this.sizeGroup.controls.size.value);
            }
        });

        this.strokeSizeSubscription = this.strokeSizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.strokeSizeGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.StrokeSize, this.strokeSizeGroup.controls.size.value);
            }
        });

        this.eraserSizeSubscription = this.eraserSizeGroup.controls.size.valueChanges.subscribe(() => {
            if (this.eraserSizeGroup.controls.size.valid) {
                this.currentToolService.setSetting(ToolSetting.EraserSize, this.eraserSizeGroup.controls.size.value);
            }
        });

        this.junctionSizeSubscription = this.junctionSizeGroup.controls.junctionSize.valueChanges.subscribe(() => {
            if (this.junctionSizeGroup.controls.junctionSize.valid) {
                this.currentToolService.setSetting(ToolSetting.JunctionSettings, {
                    hasJunction: (this.getSetting(ToolSetting.JunctionSettings) as JunctionSettings).hasJunction,
                    junctionSize: this.junctionSizeGroup.controls.junctionSize.value,
                } as JunctionSettings);
            }
        });

        this.polygonSideCountSubscription = this.polygonSideCountGroup.controls.polygonSideCount.valueChanges.subscribe(() => {
            if (this.polygonSideCountGroup.controls.polygonSideCount.valid) {
                this.currentToolService.setSetting(
                    ToolSetting.PolygonSideCount,
                    this.polygonSideCountGroup.controls.polygonSideCount.value
                );
            }
        });

        this.spraySpeedSubscription = this.spraySpeedGroup.controls.spraySpeed.valueChanges.subscribe(() => {
            if (this.spraySpeedGroup.controls.spraySpeed.valid) {
                this.currentToolService.setSetting(ToolSetting.SpraySpeed, this.spraySpeedGroup.controls.spraySpeed.value);
            }
        });

        this.sprayRadiusSubscription = this.sprayRadiusGroup.controls.sprayRadius.valueChanges.subscribe(() => {
            if (this.sprayRadiusGroup.controls.sprayRadius.valid) {
                this.currentToolService.setSetting(ToolSetting.SprayRadius, this.sprayRadiusGroup.controls.sprayRadius.value);
            }
        });
    }

    ngOnDestroy(): void {
        this.sizeSubscription.unsubscribe();
        this.junctionSizeSubscription.unsubscribe();
        this.strokeSizeSubscription.unsubscribe();
        this.eraserSizeSubscription.unsubscribe();
        this.polygonSideCountSubscription.unsubscribe();
        this.spraySpeedSubscription.unsubscribe();
        this.sprayRadiusSubscription.unsubscribe();
    }

    getToolName(): string {
        return this.currentToolService.getToolName();
    }

    getSetting(setting: ToolSetting): number | JunctionSettings | StrokeType | Texture {
        return this.currentToolService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | JunctionSettings | StrokeType | Texture): void {
        if (setting === ToolSetting.JunctionSettings) {
            if ((value as JunctionSettings).hasJunction) {
                this.junctionSizeGroup.controls.junctionSize.enable();
            } else {
                this.junctionSizeGroup.controls.junctionSize.disable();
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

    getSizeErrorMessage(): string {
        return this.getErrorMessage(this.sizeGroup.controls.size);
    }

    getJunctionSizeErrorMessage(): string {
        return this.getErrorMessage(this.junctionSizeGroup.controls.junctionSize);
    }

    getStrokeSizeErrorMessage(): string {
        return this.getErrorMessage(this.strokeSizeGroup.controls.size);
    }

    getEraserSizeErrorMessage(): string {
        return this.getErrorMessage(this.eraserSizeGroup.controls.size);
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
