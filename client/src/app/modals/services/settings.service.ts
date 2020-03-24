import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { Color } from '@app/classes/color';
import Regexes from '@app/constants/regexes';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ThemeService } from '@app/theme/services/theme.service';
import { Subscription } from 'rxjs';

@Injectable()
export class SettingsService implements OnDestroy {
    settingsFormGroup = new FormGroup({
        gridSize: new FormControl(
            '0',
            [
                Validators.required,
                Validators.min(this.gridService.minimumSize),
                Validators.max(this.gridService.maximumSize),
                Validators.pattern(Regexes.integerRegex),
            ]
        ),
        gridOpacity: new FormControl(
            '0',
            [
                Validators.required,
                Validators.min(this.gridService.minimumOpacity),
                Validators.max(this.gridService.maximumOpacity),
                Validators.pattern(Regexes.decimalRegex),
            ]
        ),
    });

    private gridSizeSubscription: Subscription;
    private gridOpacitySubscription: Subscription;

    private initialBackgroundColor = Color.fromColor(this.drawingService.backgroundColor);

    private initialGridSize = this.gridService.size;
    private initialGridOpacity = this.gridService.opacity;

    private initialIsDarkTheme = this.themeService.isDarkTheme;
    private initialThemeColor = this.themeService.color;

    constructor(private gridService: GridService, private drawingService: DrawingService, private themeService: ThemeService) {
        this.settingsFormGroup.controls.gridSize.setValue(this.gridService.size);
        this.settingsFormGroup.controls.gridOpacity.setValue(this.gridService.opacity);

        this.gridSizeSubscription = this.settingsFormGroup.controls.gridSize.valueChanges.subscribe(() => {
            if (this.settingsFormGroup.controls.gridSize.valid) {
                this.gridService.size = this.settingsFormGroup.controls.gridSize.value;
            }
        });

        this.gridOpacitySubscription = this.settingsFormGroup.controls.gridOpacity.valueChanges.subscribe(() => {
            if (this.settingsFormGroup.controls.gridOpacity.valid) {
                this.gridService.opacity = this.settingsFormGroup.controls.gridOpacity.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.gridSizeSubscription.unsubscribe();
        this.gridOpacitySubscription.unsubscribe();
    }

    resetInitialSettings(): void {
        this.drawingService.backgroundColor = this.initialBackgroundColor;

        this.gridService.size = this.initialGridSize;
        this.gridService.opacity = this.initialGridOpacity;

        this.themeService.isDarkTheme = this.initialIsDarkTheme;
        this.themeService.color = this.initialThemeColor;
    }
}
