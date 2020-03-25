import { Component, HostListener } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorService } from '@app/drawing/services/color.service';
import { MouseButton } from '@app/enums/mouse-button.enum';

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

    @HostListener('document:mousedown')
    onMouseDown(): void {
        if (!this.isMouseInside && this.isColorPickerDisplayEnabled) {
            this.confirmColor();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isMouseInside = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isMouseInside = false;
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
        this.color = this.isPrimaryColorSelected ? this.colorService.getPrimaryColor() : this.colorService.getSecondaryColor();
    }

    getSelectedColor(): Color {
        if (this.isPrimaryColorSelected) {
            return this.colorService.getPrimaryColor();
        }
        return this.colorService.getSecondaryColor();
    }

    onColorClick(event: MouseEvent, color: Color): void {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            event.button === MouseButton.Left ? this.colorService.setPrimaryColor(color) : this.colorService.setSecondaryColor(color);
        }
        this.color = Color.fromColor(color);
        this.isColorPickerDisplayEnabled = false;
    }

    confirmColor(): void {
        this.isPrimaryColorSelected ? this.colorService.setPrimaryColor(this.color) : this.colorService.setSecondaryColor(this.color);
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
}
