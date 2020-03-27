import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '@app/app/services/theme.service';
import DrawingDimensionsValidation from '@app/drawing/constants/drawing-dimensions-validation';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import Regexes from '@app/shared/constants/regexes';

@Injectable()
export class SettingsService {
    settingsFormGroup = new FormGroup({
        drawingWidth: new FormControl(this.drawingService.dimensions.x, [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
            Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
        ]),
        drawingHeight: new FormControl(this.drawingService.dimensions.y, [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
            Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
        ]),
        gridDisplayEnabled: new FormControl(this.gridService.isDisplayEnabled),
        gridSize: new FormControl({ value: this.gridService.size, disabled: !this.gridService.isDisplayEnabled }, [
            Validators.required,
            Validators.pattern(Regexes.integerRegex),
            Validators.min(this.gridService.minimumSize),
            Validators.max(this.gridService.maximumSize),
        ]),
        gridOpacity: new FormControl({ value: this.gridService.opacity, disabled: !this.gridService.isDisplayEnabled }, [
            Validators.required,
            Validators.pattern(Regexes.decimalRegex),
            Validators.min(this.gridService.minimumOpacity),
            Validators.max(this.gridService.maximumOpacity),
        ]),
    });

    private initialDrawingDimensions = { x: this.drawingService.dimensions.x, y: this.drawingService.dimensions.y };

    private initialBackgroundColor = this.drawingService.backgroundColor.clone();

    private initialIsGridDisplayEnabled = this.gridService.isDisplayEnabled;
    private initialGridSize = this.gridService.size;
    private initialGridOpacity = this.gridService.opacity;

    private initialThemeColor = this.themeService.color;
    private initialIsDarkTheme = this.themeService.isDarkTheme;

    constructor(private drawingService: DrawingService, private gridService: GridService, private themeService: ThemeService) {}

    resetInitialSettings(): void {
        this.drawingService.dimensions = this.initialDrawingDimensions;
        this.settingsFormGroup.controls.drawingWidth.reset(this.initialDrawingDimensions.x);
        this.settingsFormGroup.controls.drawingHeight.reset(this.initialDrawingDimensions.y);

        this.drawingService.backgroundColor = this.initialBackgroundColor;

        this.gridService.isDisplayEnabled = this.initialIsGridDisplayEnabled;
        this.settingsFormGroup.controls.gridDisplayEnabled.reset(this.initialIsGridDisplayEnabled);
        this.gridService.size = this.initialGridSize;
        this.settingsFormGroup.controls.gridSize.reset(this.initialGridSize);
        this.gridService.opacity = this.initialGridOpacity;
        this.settingsFormGroup.controls.gridOpacity.reset(this.initialGridOpacity);

        this.themeService.color = this.initialThemeColor;
        this.themeService.isDarkTheme = this.initialIsDarkTheme;
    }
}
