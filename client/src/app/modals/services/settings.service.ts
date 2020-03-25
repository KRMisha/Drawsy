import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { Color } from '@app/classes/color';
import Regexes from '@app/constants/regexes';
import DrawingDimensionsValidation from '@app/drawing/constants/drawing-dimensions-validation';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ThemeService } from '@app/theme/services/theme.service';

@Injectable()
export class SettingsService {
    settingsFormGroup = new FormGroup({
        drawingWidth: new FormControl(
            this.drawingService.dimensions.x,
            [
                Validators.required,
                Validators.pattern(Regexes.integerRegex),
                Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
                Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
            ]
        ),
        drawingHeight: new FormControl(
            this.drawingService.dimensions.y,
            [
                Validators.required,
                Validators.pattern(Regexes.integerRegex),
                Validators.min(DrawingDimensionsValidation.minimumDrawingDimension),
                Validators.max(DrawingDimensionsValidation.maximumDrawingDimension),
            ]
        ),
        gridSize: new FormControl(
            this.gridService.size,
            [
                Validators.required,
                Validators.pattern(Regexes.integerRegex),
                Validators.min(this.gridService.minimumSize),
                Validators.max(this.gridService.maximumSize),
            ]
        ),
        gridOpacity: new FormControl(
            this.gridService.opacity,
            [
                Validators.required,
                Validators.pattern(Regexes.decimalRegex),
                Validators.min(this.gridService.minimumOpacity),
                Validators.max(this.gridService.maximumOpacity),
            ]
        ),
    });

    private initialBackgroundColor = Color.fromColor(this.drawingService.backgroundColor);

    private initialDrawingDimensions = { x: this.drawingService.dimensions.x, y: this.drawingService.dimensions.y };

    private initialIsGridDisplayEnabled = this.gridService.isDisplayEnabled;
    private initialGridSize = this.gridService.size;
    private initialGridOpacity = this.gridService.opacity;

    private initialThemeColor = this.themeService.color;
    private initialIsDarkTheme = this.themeService.isDarkTheme;

    constructor(private gridService: GridService, private drawingService: DrawingService, private themeService: ThemeService) {}

    resetInitialSettings(): void {
        this.drawingService.backgroundColor = this.initialBackgroundColor;

        this.drawingService.dimensions = this.initialDrawingDimensions;

        this.gridService.isDisplayEnabled = this.initialIsGridDisplayEnabled;
        this.gridService.size = this.initialGridSize;
        this.gridService.opacity = this.initialGridOpacity;

        this.themeService.color = this.initialThemeColor;
        this.themeService.isDarkTheme = this.initialIsDarkTheme;

        this.settingsFormGroup.controls.drawingWidth.reset(this.initialDrawingDimensions.x, { emitEvent: false });
        this.settingsFormGroup.controls.drawingHeight.reset(this.initialDrawingDimensions.y, { emitEvent: false });

        this.settingsFormGroup.controls.gridSize.reset(this.initialGridSize, { emitEvent: false });
        this.settingsFormGroup.controls.gridOpacity.reset(this.initialGridOpacity, { emitEvent: false });
    }
}
