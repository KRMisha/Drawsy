import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '@app/classes/color';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    providers: [ColorPickerService],
})
export class ColorPickerComponent {
    @Input() colorPreviewTooltip = '';
    @Input()
    set colorModel(color: Color) {
        this.colorPickerService.setColor(color);
    }
    @Output() colorModelChange = new EventEmitter<Color>();
    @Output() colorPreviewClicked = new EventEmitter<void>();

    constructor(private colorPickerService: ColorPickerService) {
        this.colorPickerService.colorChanged$.subscribe((color: Color) => {
            this.colorModelChange.emit(color);
        });
    }

    onColorPreviewClick(): void {
        this.colorPreviewClicked.emit();
    }

    get color(): Color {
        return this.colorPickerService.getColor();
    }
}
