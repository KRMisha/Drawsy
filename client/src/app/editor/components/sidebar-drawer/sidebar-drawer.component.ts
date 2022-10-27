// tslint:disable: max-file-line-count
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { SizeFormControlContainer } from '@app/editor/classes/size-form-control-container';
import Regexes from '@app/shared/constants/regexes';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { ToolSettings } from '@app/tools/classes/tool-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import ToolValidation from '@app/tools/constants/tool-validation';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    // Make enums and constants available to template
    BrushTexture = BrushTexture;
    ShapeType = ShapeType;
    ToolValidation = ToolValidation;

    lineWidthFormControl = new FormControl(ToolDefaults.defaultLineWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumLineWidth),
        Validators.max(ToolValidation.maximumLineWidth),
    ]);
    junctionEnabledFormControl = new FormControl(ToolDefaults.defaultJunctionSettings.isEnabled);
    junctionDiameterFormControl = new FormControl(
        { value: ToolDefaults.defaultJunctionSettings.diameter, disabled: !ToolDefaults.defaultJunctionSettings.isEnabled },
        [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(ToolValidation.minimumJunctionDiameter),
            Validators.max(ToolValidation.maximumJunctionDiameter),
        ]
    );
    sprayDiameterFormControl = new FormControl(ToolDefaults.defaultSprayDiameter, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumSprayDiameter),
        Validators.max(ToolValidation.maximumSprayDiameter),
    ]);
    sprayRateFormControl = new FormControl(ToolDefaults.defaultSprayRate, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumSprayRate),
        Validators.max(ToolValidation.maximumSprayRate),
    ]);
    shapeBorderWidthFormControl = new FormControl(ToolDefaults.defaultShapeBorderWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumShapeBorderWidth),
        Validators.max(ToolValidation.maximumShapeBorderWidth),
    ]);
    polygonSideCountFormControl = new FormControl(ToolDefaults.defaultPolygonSideCount, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumPolygonSideCount),
        Validators.max(ToolValidation.maximumPolygonSideCount),
    ]);
    fillDeviationFormControl = new FormControl(ToolDefaults.defaultFillDeviation, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumFillDeviation),
        Validators.max(ToolValidation.maximumFillDeviation),
    ]);
    eraserSizeFormControl = new FormControl(ToolDefaults.defaultEraserSize, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(ToolValidation.minimumEraserSize),
        Validators.max(ToolValidation.maximumEraserSize),
    ]);
    smoothingEnabledFormControl = new FormControl(ToolDefaults.defaultSmoothingSettings.isEnabled);
    smoothingFactorFormControl = new FormControl(
        { value: ToolDefaults.defaultSmoothingSettings.factor, disabled: !ToolDefaults.defaultSmoothingSettings.isEnabled },
        [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(ToolValidation.minimumSmoothingFactor),
            Validators.max(ToolValidation.maximumSmoothingFactor),
        ]
    );
    simplificationEnabledFormControl = new FormControl(ToolDefaults.defaultSimplificationSettings.isEnabled);
    simplificationThresholdFormControl = new FormControl(
        { value: ToolDefaults.defaultSimplificationSettings.threshold, disabled: !ToolDefaults.defaultSimplificationSettings.isEnabled },
        [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(ToolValidation.minimumSimplificationThreshold),
            Validators.max(ToolValidation.maximumSimplificationThreshold),
        ]
    );

    readonly sizeFormControls: SizeFormControlContainer[] = [
        {
            formControl: this.lineWidthFormControl,
            toolSetting: ToolSetting.LineWidth,
            title: 'Largeur du trait',
            suffix: 'px',
            minimum: ToolValidation.minimumLineWidth,
            maximum: ToolValidation.maximumLineWidth,
        },
        {
            formControl: this.sprayDiameterFormControl,
            toolSetting: ToolSetting.SprayDiameter,
            title: 'Diamètre du jet',
            suffix: 'px',
            minimum: ToolValidation.minimumSprayDiameter,
            maximum: ToolValidation.maximumSprayDiameter,
        },
        {
            formControl: this.sprayRateFormControl,
            toolSetting: ToolSetting.SprayRate,
            title: 'Vitesse du jet',
            suffix: 'jets/s',
            minimum: ToolValidation.minimumSprayRate,
            maximum: ToolValidation.maximumSprayRate,
        },
        {
            formControl: this.shapeBorderWidthFormControl,
            toolSetting: ToolSetting.ShapeBorderWidth,
            title: 'Largeur de la bordure',
            suffix: 'px',
            minimum: ToolValidation.minimumShapeBorderWidth,
            maximum: ToolValidation.maximumShapeBorderWidth,
        },
        {
            formControl: this.polygonSideCountFormControl,
            toolSetting: ToolSetting.PolygonSideCount,
            title: 'Nombre de faces',
            suffix: '',
            minimum: ToolValidation.minimumPolygonSideCount,
            maximum: ToolValidation.maximumPolygonSideCount,
        },
        {
            formControl: this.fillDeviationFormControl,
            toolSetting: ToolSetting.FillDeviation,
            title: "Pourcentage d'écart ",
            suffix: '%',
            minimum: ToolValidation.minimumFillDeviation,
            maximum: ToolValidation.maximumFillDeviation,
        },
        {
            formControl: this.eraserSizeFormControl,
            toolSetting: ToolSetting.EraserSize,
            title: "Taille de l'efface",
            suffix: 'px',
            minimum: ToolValidation.minimumEraserSize,
            maximum: ToolValidation.maximumEraserSize,
        },
    ];

    private lineWidthChangedSubscription: Subscription;
    private junctionEnabledChangedSubscription: Subscription;
    private junctionDiameterChangedSubscription: Subscription;
    private sprayDiameterChangedSubscription: Subscription;
    private sprayRateChangedSubscription: Subscription;
    private shapeBorderWidthChangedSubscription: Subscription;
    private polygonSideCountChangedSubscription: Subscription;
    private fillDeviationChangedSubscription: Subscription;
    private eraserSizeChangedSubscription: Subscription;
    private smoothingEnabledChangedSubscription: Subscription;
    private smoothingFactorChangedSubscription: Subscription;
    private simplificationEnabledChangedSubscription: Subscription;
    private simplificationThresholdChangedSubscription: Subscription;

    private copySelectionShortcutSubscription: Subscription;
    private pasteSelectionShortcutSubscription: Subscription;
    private cutSelectionShortcutSubscription: Subscription;
    private duplicateSelectionShortcutSubscription: Subscription;
    private undoShortcutSubscription: Subscription;
    private redoShortcutSubscription: Subscription;

    constructor(
        private currentToolService: CurrentToolService,
        private shortcutService: ShortcutService,
        private clipboardService: ClipboardService,
        private toolSelectionService: ToolSelectionService,
        private historyService: HistoryService
    ) {}

    ngOnInit(): void {
        this.lineWidthChangedSubscription = this.lineWidthFormControl.valueChanges.subscribe(() => {
            if (this.lineWidthFormControl.valid) {
                this.currentToolSettings.lineWidth = this.lineWidthFormControl.value;
            }
        });
        this.junctionEnabledChangedSubscription = this.junctionEnabledFormControl.valueChanges.subscribe(() => {
            // tslint:disable-next-line: no-non-null-assertion
            this.currentToolSettings.junctionSettings!.isEnabled = this.junctionEnabledFormControl.value;
            this.junctionEnabledFormControl.value ? this.junctionDiameterFormControl.enable() : this.junctionDiameterFormControl.disable();
        });
        this.junctionDiameterChangedSubscription = this.junctionDiameterFormControl.valueChanges.subscribe(() => {
            if (this.junctionDiameterFormControl.valid) {
                // tslint:disable-next-line: no-non-null-assertion
                this.currentToolSettings.junctionSettings!.diameter = this.junctionDiameterFormControl.value;
            }
        });
        this.sprayDiameterChangedSubscription = this.sprayDiameterFormControl.valueChanges.subscribe(() => {
            if (this.sprayDiameterFormControl.valid) {
                this.currentToolSettings.sprayDiameter = this.sprayDiameterFormControl.value;
            }
        });
        this.sprayRateChangedSubscription = this.sprayRateFormControl.valueChanges.subscribe(() => {
            if (this.sprayRateFormControl.valid) {
                this.currentToolSettings.sprayRate = this.sprayRateFormControl.value;
            }
        });
        this.shapeBorderWidthChangedSubscription = this.shapeBorderWidthFormControl.valueChanges.subscribe(() => {
            if (this.shapeBorderWidthFormControl.valid) {
                this.currentToolSettings.shapeBorderWidth = this.shapeBorderWidthFormControl.value;
            }
        });
        this.polygonSideCountChangedSubscription = this.polygonSideCountFormControl.valueChanges.subscribe(() => {
            if (this.polygonSideCountFormControl.valid) {
                this.currentToolSettings.polygonSideCount = this.polygonSideCountFormControl.value;
            }
        });
        this.fillDeviationChangedSubscription = this.fillDeviationFormControl.valueChanges.subscribe(() => {
            if (this.fillDeviationFormControl.valid) {
                this.currentToolSettings.fillDeviation = this.fillDeviationFormControl.value;
            }
        });
        this.eraserSizeChangedSubscription = this.eraserSizeFormControl.valueChanges.subscribe(() => {
            if (this.eraserSizeFormControl.valid) {
                this.currentToolSettings.eraserSize = this.eraserSizeFormControl.value;
            }
        });
        this.smoothingEnabledChangedSubscription = this.smoothingEnabledFormControl.valueChanges.subscribe(() => {
            // tslint:disable-next-line: no-non-null-assertion
            this.currentToolSettings.smoothingSettings!.isEnabled = this.smoothingEnabledFormControl.value;
            this.smoothingEnabledFormControl.value ? this.smoothingFactorFormControl.enable() : this.smoothingFactorFormControl.disable();
        });
        this.smoothingFactorChangedSubscription = this.smoothingFactorFormControl.valueChanges.subscribe(() => {
            if (this.smoothingFactorFormControl.valid) {
                // tslint:disable-next-line: no-non-null-assertion
                this.currentToolSettings.smoothingSettings!.factor = this.smoothingFactorFormControl.value;
            }
        });
        this.simplificationEnabledChangedSubscription = this.simplificationEnabledFormControl.valueChanges.subscribe(() => {
            // tslint:disable-next-line: no-non-null-assertion
            this.currentToolSettings.simplificationSettings!.isEnabled = this.simplificationEnabledFormControl.value;
            this.simplificationEnabledFormControl.value
                ? this.simplificationThresholdFormControl.enable()
                : this.simplificationThresholdFormControl.disable();
        });
        this.simplificationThresholdChangedSubscription = this.simplificationThresholdFormControl.valueChanges.subscribe(() => {
            if (this.simplificationThresholdFormControl.valid) {
                // tslint:disable-next-line: no-non-null-assertion
                this.currentToolSettings.simplificationSettings!.threshold = this.simplificationThresholdFormControl.value;
            }
        });

        this.copySelectionShortcutSubscription = this.shortcutService.copySelectionShortcut$.subscribe(() => {
            this.copy();
        });
        this.pasteSelectionShortcutSubscription = this.shortcutService.pasteSelectionShortcut$.subscribe(() => {
            this.paste();
        });
        this.cutSelectionShortcutSubscription = this.shortcutService.cutSelectionShortcut$.subscribe(() => {
            this.cut();
        });
        this.duplicateSelectionShortcutSubscription = this.shortcutService.duplicateSelectionShortcut$.subscribe(() => {
            this.duplicate();
        });
        this.undoShortcutSubscription = this.shortcutService.undoShortcut$.subscribe(() => {
            this.undo();
        });
        this.redoShortcutSubscription = this.shortcutService.redoShortcut$.subscribe(() => {
            this.redo();
        });
    }

    ngOnDestroy(): void {
        this.lineWidthChangedSubscription.unsubscribe();
        this.junctionEnabledChangedSubscription.unsubscribe();
        this.junctionDiameterChangedSubscription.unsubscribe();
        this.sprayDiameterChangedSubscription.unsubscribe();
        this.sprayRateChangedSubscription.unsubscribe();
        this.shapeBorderWidthChangedSubscription.unsubscribe();
        this.polygonSideCountChangedSubscription.unsubscribe();
        this.fillDeviationChangedSubscription.unsubscribe();
        this.eraserSizeChangedSubscription.unsubscribe();
        this.smoothingEnabledChangedSubscription.unsubscribe();
        this.smoothingFactorChangedSubscription.unsubscribe();
        this.simplificationEnabledChangedSubscription.unsubscribe();
        this.simplificationThresholdChangedSubscription.unsubscribe();

        this.copySelectionShortcutSubscription.unsubscribe();
        this.pasteSelectionShortcutSubscription.unsubscribe();
        this.cutSelectionShortcutSubscription.unsubscribe();
        this.duplicateSelectionShortcutSubscription.unsubscribe();
        this.undoShortcutSubscription.unsubscribe();
        this.redoShortcutSubscription.unsubscribe();
    }

    resetCurrentControls(): void {
        if (this.currentToolSettings.lineWidth !== undefined) {
            this.lineWidthFormControl.reset(this.currentToolSettings.lineWidth);
        }
        if (this.currentToolSettings.junctionSettings !== undefined) {
            this.junctionEnabledFormControl.reset(this.currentToolSettings.junctionSettings.isEnabled);
        }
        if (this.currentToolSettings.junctionSettings !== undefined) {
            this.junctionDiameterFormControl.reset(this.currentToolSettings.junctionSettings.diameter);
        }
        if (this.currentToolSettings.sprayDiameter !== undefined) {
            this.sprayDiameterFormControl.reset(this.currentToolSettings.sprayDiameter);
        }
        if (this.currentToolSettings.sprayRate !== undefined) {
            this.sprayRateFormControl.reset(this.currentToolSettings.sprayRate);
        }
        if (this.currentToolSettings.shapeBorderWidth !== undefined) {
            this.shapeBorderWidthFormControl.reset(this.currentToolSettings.shapeBorderWidth);
        }
        if (this.currentToolSettings.polygonSideCount !== undefined) {
            this.polygonSideCountFormControl.reset(this.currentToolSettings.polygonSideCount);
        }
        if (this.currentToolSettings.fillDeviation !== undefined) {
            this.fillDeviationFormControl.reset(this.currentToolSettings.fillDeviation);
        }
        if (this.currentToolSettings.eraserSize !== undefined) {
            this.eraserSizeFormControl.reset(this.currentToolSettings.eraserSize);
        }
        if (this.currentToolSettings.smoothingSettings !== undefined) {
            this.smoothingEnabledFormControl.reset(this.currentToolSettings.smoothingSettings.isEnabled);
        }
        if (this.currentToolSettings.smoothingSettings !== undefined) {
            this.smoothingFactorFormControl.reset(this.currentToolSettings.smoothingSettings.factor);
        }
        if (this.currentToolSettings.simplificationSettings !== undefined) {
            this.simplificationEnabledFormControl.reset(this.currentToolSettings.simplificationSettings.isEnabled);
        }
        if (this.currentToolSettings.simplificationSettings !== undefined) {
            this.simplificationThresholdFormControl.reset(this.currentToolSettings.simplificationSettings.threshold);
        }
    }

    copy(): void {
        this.clipboardService.copy();
    }

    paste(): void {
        if (this.isPastingAvailable) {
            this.currentToolService.currentTool = this.toolSelectionService;
            this.resetCurrentControls();
            this.clipboardService.paste();
        }
    }

    cut(): void {
        this.clipboardService.cut();
    }

    duplicate(): void {
        this.clipboardService.duplicate();
    }

    delete(): void {
        this.toolSelectionService.deleteSelection();
    }

    undo(): void {
        this.historyService.undo();
    }

    redo(): void {
        this.historyService.redo();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, 'Entiers');
    }

    getProperty<T, K extends keyof T>(object: T, propertyName: K): T[K] {
        return object[propertyName];
    }

    get currentToolName(): string {
        return this.currentToolService.currentTool.info.name;
    }

    get currentToolSettings(): ToolSettings {
        return this.currentToolService.currentTool.settings;
    }

    get isSelectionAvailable(): boolean {
        return this.clipboardService.isSelectionAvailable();
    }

    get isPastingAvailable(): boolean {
        return this.clipboardService.isPastingAvailable();
    }

    get isUndoAvailable(): boolean {
        return this.historyService.canUndo();
    }

    get isRedoAvailable(): boolean {
        return this.historyService.canRedo();
    }
}
