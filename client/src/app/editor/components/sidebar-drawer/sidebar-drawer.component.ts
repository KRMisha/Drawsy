import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandService } from '@app/drawing/services/command.service';
import Regexes from '@app/shared/constants/regexes';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
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

    @Input()
    set selectedToolIndex(index: number) {
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

    private undoShortcutSubscription: Subscription;
    private redoShortcutSubscription: Subscription;

    private lineWidthChangedSubscription: Subscription;
    private junctionDiameterChangedSubscription: Subscription;
    private sprayDiameterChangedSubscription: Subscription;
    private sprayRateChangedSubscription: Subscription;
    private shapeBorderWidthChangedSubscription: Subscription;
    private polygonSideCountChangedSubscription: Subscription;
    private eraserSizeChangedSubscription: Subscription;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private currentToolService: CurrentToolService,
        private shortcutService: ShortcutService,
        private commandService: CommandService
    ) {}

    ngOnInit(): void {
        this.iconRegistry.addSvgIcon(
            'fill-with-border',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/shape-types/fill-with-border.svg')
        );
        this.iconRegistry.addSvgIcon('fill-only', this.sanitizer.bypassSecurityTrustResourceUrl('assets/shape-types/fill-only.svg'));
        this.iconRegistry.addSvgIcon('border-only', this.sanitizer.bypassSecurityTrustResourceUrl('assets/shape-types/border-only.svg'));

        this.undoShortcutSubscription = this.shortcutService.undoShortcut$.subscribe(() => {
            this.undoCommand();
        });
        this.redoShortcutSubscription = this.shortcutService.redoShortcut$.subscribe(() => {
            this.redoCommand();
        });

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
        this.undoShortcutSubscription.unsubscribe();
        this.redoShortcutSubscription.unsubscribe();

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

    undoCommand(): void {
        this.commandService.undo();
        this.currentToolService.selectedTool.onToolDeselection();
    }

    redoCommand(): void {
        this.commandService.redo();
        this.currentToolService.selectedTool.onToolDeselection();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, '0-9');
    }

    get toolName(): string {
        return this.currentToolService.getToolName();
    }

    get isUndoAvailable(): boolean {
        return this.commandService.hasUndoCommands();
    }

    get isRedoAvailable(): boolean {
        return this.commandService.hasRedoCommands();
    }
}
