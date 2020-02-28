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
    get color(): Color {
        return this.colorPickerService.getColor();
    }

    @Input()
    set colorModel(color: Color) {
        this.colorPickerService.setColor(color);
    }

    @Output() colorModelChange = new EventEmitter<Color>();

    constructor(protected colorPickerService: ColorPickerService) {
        this.colorPickerService.colorChanged$.subscribe((color) => {
            this.colorModelChange.emit(color);
        });
    }
}
