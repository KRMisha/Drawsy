import { Component, HostListener } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorService } from '@app/drawing/services/color.service';
import { ButtonId } from '@app/editor/enums/button-id.enum';

@Component({
    selector: 'app-sidebar-color-picker',
    templateUrl: './sidebar-color-picker.component.html',
    styleUrls: ['./sidebar-color-picker.component.scss'],
})
export class SidebarColorPickerComponent {
    color = Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb);

    isColorPickerDisplayEnabled = false;
    isPrimaryColorSelected = true;

    private isMouseInside = false;

    constructor(private colorService: ColorService) {}

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    @HostListener('document:mousedown')
    onMouseDown(): void {
        if (!this.isMouseInside && this.isColorPickerDisplayEnabled) {
            this.confirmColor();
        }
    }

    selectPrimaryColor(): void {
        this.isPrimaryColorSelected = true;
        this.isColorPickerDisplayEnabled = true;
        this.color = this.colorService.getPrimaryColor();
    }

    selectSecondaryColor(): void {
        this.isPrimaryColorSelected = false;
        this.isColorPickerDisplayEnabled = true;
        this.color = this.colorService.getSecondaryColor();
    }

    updateColor(color: Color): void {
        this.color = color;
    }

    swapColors(): void {
        this.colorService.swapPrimaryAndSecondaryColors();
        if (this.isPrimaryColorSelected) {
            this.color = this.colorService.getPrimaryColor();
        } else {
            this.color = this.colorService.getSecondaryColor();
        }
    }

    getSelectedColor(): Color {
        if (this.isPrimaryColorSelected) {
            return this.colorService.getPrimaryColor();
        }
        return this.colorService.getSecondaryColor();
    }

    onColorClick(event: MouseEvent, color: Color): void {
        if (event.button === ButtonId.Left || event.button === ButtonId.Right) {
            if (event.button === ButtonId.Left) {
                this.colorService.setPrimaryColor(color);
            } else {
                this.colorService.setSecondaryColor(color);
            }
        }
        this.color = Color.fromColor(color);
        this.isColorPickerDisplayEnabled = false;
    }

    get primaryColor(): string {
        return this.colorService.getPrimaryColor().toRgbString();
    }

    get secondaryColor(): string {
        return this.colorService.getSecondaryColor().toRgbString();
    }

    get previousColors(): Color[] {
        return this.colorService.getPreviousColors();
    }

    private confirmColor(): void {
        if (this.isPrimaryColorSelected) {
            this.colorService.setPrimaryColor(this.color);
        } else {
            this.colorService.setSecondaryColor(this.color);
        }
        this.isColorPickerDisplayEnabled = false;
    }
}
