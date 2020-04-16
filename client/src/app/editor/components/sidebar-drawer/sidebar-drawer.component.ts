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
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subscription } from 'rxjs';

const minimumLineWidth = 1;
const maximumLineWidth = 500;
const minimumSprayDiameter = 20;
const maximumSprayDiameter = 350;
const minimumSprayRate = 10;
const maximumSprayRate = 100;
const minimumShapeBorderWidth = 1;
const maximumShapeBorderWidth = 100;
const minimumPolygonSideCount = 3;
const maximumPolygonSideCount = 12;
const minimumEraserSize = 3;
const maximumEraserSize = 25;

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    // Make enums available to template
    BrushTexture = BrushTexture;
    ShapeType = ShapeType;

    readonly minimumJunctionDiameter = 5;
    readonly maximumJunctionDiameter = 500;

    lineWidthFormControl = new FormControl(ToolDefaults.defaultLineWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(minimumLineWidth),
        Validators.max(maximumLineWidth),
    ]);

    junctionEnabledFormControl = new FormControl(ToolDefaults.defaultJunctionSettings.isEnabled);

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
        Validators.min(minimumSprayDiameter),
        Validators.max(maximumSprayDiameter),
    ]);

    sprayRateFormControl = new FormControl(ToolDefaults.defaultSprayRate, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(minimumSprayRate),
        Validators.max(maximumSprayRate),
    ]);

    polygonSideCountFormControl = new FormControl(ToolDefaults.defaultPolygonSideCount, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(minimumPolygonSideCount),
        Validators.max(maximumPolygonSideCount),
    ]);

    shapeBorderWidthFormControl = new FormControl(ToolDefaults.defaultShapeBorderWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(minimumShapeBorderWidth),
        Validators.max(maximumShapeBorderWidth),
    ]);

    eraserSizeFormControl = new FormControl(ToolDefaults.defaultEraserSize, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(minimumEraserSize),
        Validators.max(maximumEraserSize),
    ]);

    readonly sizeFormControls: SizeFormControlContainer[] = [
        {
            formControl: this.lineWidthFormControl,
            toolSetting: ToolSetting.LineWidth,
            title: 'Largeur du trait',
            suffix: 'px',
            minimum: minimumLineWidth,
            maximum: maximumLineWidth,
        },
        {
            formControl: this.sprayDiameterFormControl,
            toolSetting: ToolSetting.SprayDiameter,
            title: 'Diamètre du jet',
            suffix: 'px',
            minimum: minimumSprayDiameter,
            maximum: maximumSprayDiameter,
        },
        {
            formControl: this.sprayRateFormControl,
            toolSetting: ToolSetting.SprayRate,
            title: 'Vitesse du jet',
            suffix: 'jets/s',
            minimum: minimumSprayRate,
            maximum: maximumSprayRate,
        },
        {
            formControl: this.shapeBorderWidthFormControl,
            toolSetting: ToolSetting.ShapeBorderWidth,
            title: 'Largeur de la bordure',
            suffix: 'px',
            minimum: minimumShapeBorderWidth,
            maximum: maximumShapeBorderWidth,
        },
        {
            formControl: this.polygonSideCountFormControl,
            toolSetting: ToolSetting.PolygonSideCount,
            title: 'Nombre de faces',
            suffix: '',
            minimum: minimumPolygonSideCount,
            maximum: maximumPolygonSideCount,
        },
        {
            formControl: this.eraserSizeFormControl,
            toolSetting: ToolSetting.EraserSize,
            title: "Taille de l'efface",
            suffix: 'px',
            minimum: minimumEraserSize,
            maximum: maximumEraserSize,
        },
    ];

    private lineWidthChangedSubscription: Subscription;
    private junctionEnabledChangedSubscription: Subscription;
    private junctionDiameterChangedSubscription: Subscription;
    private sprayDiameterChangedSubscription: Subscription;
    private sprayRateChangedSubscription: Subscription;
    private shapeBorderWidthChangedSubscription: Subscription;
    private polygonSideCountChangedSubscription: Subscription;
    private eraserSizeChangedSubscription: Subscription;

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
        this.eraserSizeChangedSubscription = this.eraserSizeFormControl.valueChanges.subscribe(() => {
            if (this.eraserSizeFormControl.valid) {
                this.currentToolSettings.eraserSize = this.eraserSizeFormControl.value;
            }
        });

        this.copySelectionShortcutSubscription = this.shortcutService.copySelectionShortcut$.subscribe(() => {
            this.copyCommand();
        });
        this.pasteSelectionShortcutSubscription = this.shortcutService.pasteSelectionShortcut$.subscribe(() => {
            this.pasteCommand();
        });
        this.cutSelectionShortcutSubscription = this.shortcutService.cutSelectionShortcut$.subscribe(() => {
            this.cutCommand();
        });
        this.duplicateSelectionShortcutSubscription = this.shortcutService.duplicateSelectionShortcut$.subscribe(() => {
            this.duplicateCommand();
        });
        this.undoShortcutSubscription = this.shortcutService.undoShortcut$.subscribe(() => {
            this.undoCommand();
        });
        this.redoShortcutSubscription = this.shortcutService.redoShortcut$.subscribe(() => {
            this.redoCommand();
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
        this.eraserSizeChangedSubscription.unsubscribe();

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
        if (this.currentToolSettings.eraserSize !== undefined) {
            this.eraserSizeFormControl.reset(this.currentToolSettings.eraserSize);
        }
    }

    copyCommand(): void {
        this.clipboardService.copy();
    }

    pasteCommand(): void {
        if (this.isPastingAvailable) {
            this.currentToolService.currentTool = this.toolSelectionService;
            this.resetCurrentControls();
            this.clipboardService.paste();
        }
    }

    cutCommand(): void {
        this.clipboardService.cut();
    }

    duplicateCommand(): void {
        this.clipboardService.duplicate();
    }

    deleteCommand(): void {
        this.toolSelectionService.deleteSelection();
    }

    undoCommand(): void {
        this.historyService.undo();
    }

    redoCommand(): void {
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
