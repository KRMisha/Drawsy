import { Component } from '@angular/core';
import { Color, maxColorValue } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { ToolSelectorService } from '../../../services/drawing/tool-selector/tool-selector.service';
import { StrokeTypes, Textures, ToolSetting } from '../../../services/drawing/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSetting = ToolSetting; // Make enums available to template
    Textures = Textures;
    StrokeTypes = StrokeTypes;

    isPrimarySelected = true;
    isColorPickerDisplayEnabled = false;

    private color = new Color();

    constructor(private toolSelectorService: ToolSelectorService, private colorService: ColorService) {
        this.color.red = maxColorValue;
        this.color.green = maxColorValue;
        this.color.blue = maxColorValue;
    }

    getToolName(): string {
        return this.toolSelectorService.getToolName();
    }

    getSetting(setting: ToolSetting): number | [boolean, number] | StrokeTypes | Textures {
        return this.toolSelectorService.getSetting(setting);
    }

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures) {
        this.toolSelectorService.setSetting(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolSelectorService.hasSetting(setting);
    }

    getPrimaryColor(): Color {
        return this.colorService.getPrimaryColor();
    }

    getSecondaryColor(): Color {
        return this.colorService.getSecondaryColor();
    }

    selectPrimaryColor(): void {
        this.isPrimarySelected = true;
        this.isColorPickerDisplayEnabled = true;
    }

    selectSecondaryColor(): void {
        this.isPrimarySelected = false;
        this.isColorPickerDisplayEnabled = true;
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
        this.isColorPickerDisplayEnabled = false;
    }

    swapColors(): void {
        this.colorService.swapPrimaryAndSecondaryColors();
    }

    getSelectedColor(): Color {
        if (this.isPrimarySelected) {
            return this.colorService.getPrimaryColor();
        } else {
            return this.colorService.getSecondaryColor();
        }
    }
}
