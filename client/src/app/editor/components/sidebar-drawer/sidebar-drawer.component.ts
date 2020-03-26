import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandService } from '@app/drawing/services/command.service';
import Regexes from '@app/shared/constants/regexes';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { ToolSettings } from '@app/tools/classes/tool-settings';
import ToolDefaults from '@app/tools/constants/tool-defaults';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent implements OnInit, OnDestroy {
    // Make enums available to template
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

    lineWidthFormControl = new FormControl(ToolDefaults.defaultLineWidth, [
        Validators.required,
        Validators.pattern(Regexes.integerRegex),
        Validators.min(this.minimumLineWidth),
        Validators.max(this.maximumLineWidth),
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

    private lineWidthChangedSubscription: Subscription;
    private junctionEnabledChangedSubscription: Subscription;
    private junctionDiameterChangedSubscription: Subscription;
    private sprayDiameterChangedSubscription: Subscription;
    private sprayRateChangedSubscription: Subscription;
    private shapeBorderWidthChangedSubscription: Subscription;
    private polygonSideCountChangedSubscription: Subscription;
    private eraserSizeChangedSubscription: Subscription;

    private undoShortcutSubscription: Subscription;
    private redoShortcutSubscription: Subscription;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private currentToolService: CurrentToolService,
        private shortcutService: ShortcutService,
        private commandService: CommandService
    ) {}

    ngOnInit(): void {
        const shapeTypeIconNames = ['fill-with-border', 'fill-only', 'border-only'];
        for (const icon of shapeTypeIconNames) {
            this.iconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl('assets/shape-types/' + icon + '.svg'));
        }

        this.lineWidthChangedSubscription = this.lineWidthFormControl.valueChanges.subscribe(() => {
            if (this.lineWidthFormControl.valid) {
                this.currentToolSettings.lineWidth = this.lineWidthFormControl.value;
            }
        });
        this.junctionEnabledChangedSubscription = this.junctionEnabledFormControl.valueChanges.subscribe(() => {
            // tslint:disable-next-line: no-non-null-assertion
            this.currentToolSettings.junctionSettings!.isEnabled = this.junctionEnabledFormControl.value;
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

        this.undoShortcutSubscription.unsubscribe();
        this.redoShortcutSubscription.unsubscribe();
    }

    resetCurrentControls(): void {
        if (this.currentToolSettings.lineWidth !== undefined) {
            this.lineWidthFormControl.reset(this.currentToolSettings.lineWidth, { emitEvent: false });
        }
        if (this.currentToolSettings.junctionSettings !== undefined) {
            this.junctionEnabledFormControl.reset(this.currentToolSettings.junctionSettings.isEnabled, { emitEvent: false });
        }
        if (this.currentToolSettings.junctionSettings !== undefined) {
            this.junctionDiameterFormControl.reset(this.currentToolSettings.junctionSettings.diameter, { emitEvent: false });
        }
        if (this.currentToolSettings.sprayDiameter !== undefined) {
            this.sprayDiameterFormControl.reset(this.currentToolSettings.sprayDiameter, { emitEvent: false });
        }
        if (this.currentToolSettings.sprayRate !== undefined) {
            this.sprayRateFormControl.reset(this.currentToolSettings.sprayRate, { emitEvent: false });
        }
        if (this.currentToolSettings.shapeBorderWidth !== undefined) {
            this.shapeBorderWidthFormControl.reset(this.currentToolSettings.shapeBorderWidth, { emitEvent: false });
        }
        if (this.currentToolSettings.polygonSideCount !== undefined) {
            this.polygonSideCountFormControl.reset(this.currentToolSettings.polygonSideCount, { emitEvent: false });
        }
        if (this.currentToolSettings.eraserSize !== undefined) {
            this.eraserSizeFormControl.reset(this.currentToolSettings.eraserSize, { emitEvent: false });
        }
    }

    undoCommand(): void {
        this.commandService.undo();
        this.currentToolService.currentTool.onToolDeselection();
    }

    redoCommand(): void {
        this.commandService.redo();
        this.currentToolService.currentTool.onToolDeselection();
    }

    getErrorMessage(formControl: AbstractControl): string {
        return ErrorMessageService.getErrorMessage(formControl, '0-9');
    }

    get currentToolName(): string {
        return this.currentToolService.currentTool.name;
    }

    get currentToolSettings(): ToolSettings {
        return this.currentToolService.currentTool.settings;
    }

    get isUndoAvailable(): boolean {
        return this.commandService.hasUndoCommands();
    }

    get isRedoAvailable(): boolean {
        return this.commandService.hasRedoCommands();
    }
}
