import { Component, Input } from '@angular/core';
import { Color, MAX_COLOR_VALUE } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { SidebarButton } from '../../../classes/sidebar-button/sidebar-button';
import { ToolHolderService } from '../../../services/drawing/tool-holder/tool-holder.service';
import { Style, ToolSetting } from '../../../services/drawing/tools/tool';

const numberRegex = new RegExp('^[0-9]+$');

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSetting = ToolSetting; // Make enum available to template
    @Input() selectedButton: SidebarButton;

    isPrimarySelected = true;
    isColorPickerDisplayEnabled = false;

    private color = new Color();

    constructor(public toolHolderService: ToolHolderService, private colorService: ColorService) {
        this.color.red = MAX_COLOR_VALUE;
        this.color.green = MAX_COLOR_VALUE;
        this.color.blue = MAX_COLOR_VALUE;
    }

    getSetting(setting: ToolSetting): number | [boolean, number] | Style {
        const value = this.toolHolderService.tools[this.selectedButton.toolIndex].toolSettings.get(setting);
        return value as number | [boolean, number] | Style;
    }

    setSetting(setting: ToolSetting, value: number | [boolean, number] | Style) {
        if (
            (setting === ToolSetting.Size && !numberRegex.test(value.toString())) ||
            (setting === ToolSetting.HasJunction && !numberRegex.test((value as [boolean, number])[1].toString()))
        ) {
            return;
        }
        this.toolHolderService.tools[this.selectedButton.toolIndex].toolSettings.set(setting, value);
    }

    hasSetting(setting: ToolSetting): boolean {
        return this.toolHolderService.tools[this.selectedButton.toolIndex].toolSettings.has(setting);
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
