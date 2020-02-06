import { Component, Input } from '@angular/core';
import { Color, MAX_COLOR_VALUE } from 'src/app/classes/color/color';
import { ColorService } from 'src/app/services/color/color.service';
import { SidebarButton } from '../../../classes/sidebar-button/sidebar-button';
import { ToolHolderService } from '../../../services/drawing/tool-holder/tool-holder.service';
import { ToolSetting } from '../../../services/drawing/tools/tool';

@Component({
    selector: 'app-panel-settings',
    templateUrl: './panel-settings.component.html',
    styleUrls: ['./panel-settings.component.scss'],
})
export class PanelSettingsComponent {
    ToolSetting = ToolSetting; // Make enum available to template
    @Input() selectedButton: SidebarButton;

    isPrimarySelected = true;
    displayColorPicker = false;

    private color = new Color(MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE, 1);

    constructor(public toolHolderService: ToolHolderService, private colorService: ColorService) {}

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
        console.log(color);
    }

    confirmColor(): void {
        if (this.isPrimarySelected) {
            this.colorService.setPrimaryColor(this.color);
        } else {
            this.colorService.setSecondaryColor(this.color);
        }
        this.displayColorPicker = false;
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
