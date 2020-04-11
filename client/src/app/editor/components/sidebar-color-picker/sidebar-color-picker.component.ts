import { Component, HostListener } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';

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
        this.color = this.colorService.primaryColor;
    }

    selectSecondaryColor(): void {
        this.isPrimaryColorSelected = false;
        this.isColorPickerDisplayEnabled = true;
        this.color = this.colorService.secondaryColor;
    }

    swapColors(): void {
        this.colorService.swapPrimaryAndSecondaryColors();
        this.color = this.isPrimaryColorSelected ? this.colorService.primaryColor : this.colorService.secondaryColor;
    }

    onLastColorClick(event: MouseEvent, color: Color): void {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            event.button === MouseButton.Left ? (this.colorService.primaryColor = color) : (this.colorService.secondaryColor = color);
        }
        this.color = color;
        this.isColorPickerDisplayEnabled = false;
    }

    confirmColor(): void {
        this.isPrimaryColorSelected ? (this.colorService.primaryColor = this.color) : (this.colorService.secondaryColor = this.color);
        this.isColorPickerDisplayEnabled = false;
    }

    get primaryColor(): Color {
        return this.colorService.primaryColor;
    }

    get secondaryColor(): Color {
        return this.colorService.secondaryColor;
    }

    get lastColors(): Color[] {
        return this.colorService.lastColors;
    }
}
