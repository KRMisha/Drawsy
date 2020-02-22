import { Component } from '@angular/core';
import { Color, maxColorValue } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/drawing/services/color.service';
import { StrokeTypes, Textures, ToolSetting } from '../../../tools/services/tool';
import { ToolSelectorService } from '../../../tools/services/tool-selector.service';

@Component({
    selector: 'app-sidebar-drawer',
    templateUrl: './sidebar-drawer.component.html',
    styleUrls: ['./sidebar-drawer.component.scss'],
})
export class SidebarDrawerComponent {
    // Make enums available to template
    ToolSetting = ToolSetting;
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

    setSetting(setting: ToolSetting, value: number | [boolean, number] | StrokeTypes | Textures): void {
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
        }
        return this.colorService.getSecondaryColor();
    }
}
