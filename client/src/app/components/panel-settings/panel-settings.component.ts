import { Component, Input } from '@angular/core';
import { Button } from 'src/app/classes/button/button-data';
import { Color, MAX_COLOR_VALUE } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { ToolSettings } from '../../classes/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSettings = ToolSettings; // Make enum available to template
    @Input() selectedButton: Button;

    isPrimarySelected = true;
    displayColorPicker = false;

    private color = new Color(MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE, 1);

    constructor(private colorService: ColorService) {
    }

    getPrimaryColor(): Color {
        return this.colorService.getPrimaryColor();
    }

    getSecondaryColor(): Color {
        return this.colorService.getSecondaryColor();
    }

    selectPrimaryColor(): void {
        this.isPrimarySelected = true;
        this.displayColorPicker = true;
    }

    selectSecondaryColor(): void {
        this.isPrimarySelected = false;
        this.displayColorPicker = true;
    }

    updateColor(color: Color): void {
        this.color = color;
    }

    confirmColor(): void {
        if (this.isPrimarySelected) {
            this.colorService.setPrimaryColor(this.color);
        } else {
            this.colorService.setSecondaryColor(this.color);
        }
        this.displayColorPicker = false;
    }
}
