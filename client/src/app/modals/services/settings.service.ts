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

    private initialIsGridDisplayEnabled = this.gridService.isDisplayEnabled;
    private initialGridSize = this.gridService.size;
    private initialGridOpacity = this.gridService.opacity;

    private initialThemeColor = this.themeService.color;
    private initialIsDarkTheme = this.themeService.isDarkTheme;

    constructor(private gridService: GridService, private drawingService: DrawingService, private themeService: ThemeService) {}

    resetInitialSettings(): void {
        this.drawingService.backgroundColor = this.initialBackgroundColor;

        this.gridService.isDisplayEnabled = this.initialIsGridDisplayEnabled;
        this.gridService.size = this.initialGridSize;
        this.gridService.opacity = this.initialGridOpacity;

        this.themeService.color = this.initialThemeColor;
        this.themeService.isDarkTheme = this.initialIsDarkTheme;

        // reste form control values so it updates visually
        // use .reset(val, { emitEvents: false });

        // see if form.reset resets to initial settings, not null, and if so use it
    }
}
