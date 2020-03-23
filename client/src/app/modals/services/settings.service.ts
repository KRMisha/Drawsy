import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { ThemeService } from '@app/theme/services/theme.service';

@Injectable()
export class SettingsService {
    private initialBackgroundColor = Color.fromColor(this.drawingService.backgroundColor);

    private initialGridSize = this.gridService.size;
    private initialGridOpacity = this.gridService.opacity;

    private initialIsDarkTheme = this.themeService.isDarkTheme;
    private initialThemeColor = this.themeService.color;

    constructor(private gridService: GridService, private drawingService: DrawingService, private themeService: ThemeService) {}

    resetInitialSettings(): void {
        this.drawingService.backgroundColor = this.initialBackgroundColor;

        this.gridService.size = this.initialGridSize;
        this.gridService.opacity = this.initialGridOpacity;

        this.themeService.isDarkTheme = this.initialIsDarkTheme;
        this.themeService.color = this.initialThemeColor;
    }
}
