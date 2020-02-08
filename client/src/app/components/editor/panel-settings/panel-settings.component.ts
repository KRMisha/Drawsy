import { Component } from '@angular/core';
import { Color, MAX_COLOR_VALUE } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { ToolSelectorService } from '../../../services/drawing/tool-selector/tool-selector.service';
import { StrokeTypes, Textures, ToolSetting } from '../../../services/drawing/tools/tool';

const numberRegex = new RegExp('^[0-9]+$');

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
        this.color.red = MAX_COLOR_VALUE;
        this.color.green = MAX_COLOR_VALUE;
        this.color.blue = MAX_COLOR_VALUE;
    }

    getToolName(): string {
        return this.toolSelectorService.selectedTool.name;
    }

    getSetting(setting: ToolSetting): number | [boolean, number] | StrokeTypes | Textures {
        const value = this.toolSelectorService.selectedTool.toolSettings.get(setting);
        return value as number | [boolean, number] | StrokeTypes | Textures;
    }

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures) {
        if (
            (setting === ToolSetting.Size && !numberRegex.test(value.toString())) ||
            (setting === ToolSetting.HasJunction && !numberRegex.test((value as [boolean, number])[1].toString()))
        ) {
            return;
        }
        this.toolSelectorService.selectedTool.toolSettings.set(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolSelectorService.selectedTool.toolSettings.has(setting);
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
