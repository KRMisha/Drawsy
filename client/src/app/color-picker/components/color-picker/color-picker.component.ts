import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Subscription, merge } from 'rxjs';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    providers: [ColorPickerService],
})
export class ColorPickerComponent implements OnInit, OnDestroy {
    @Input() colorPreviewTooltip = '';
    @Input()
    set colorModel(color: Color) {
        this.colorPickerService.setColor(color);
    }
    @Output() colorModelChange = new EventEmitter<Color>();
    @Output() colorPreviewClicked = new EventEmitter<void>();

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngOnInit(): void {
        this.colorChangedSubscription = merge(this.colorPickerService.hueChanged$,
                    this.colorPickerService.saturationChanged$,
                    this.colorPickerService.valueChanged$,
                    this.colorPickerService.alphaChanged$).subscribe(() => {
            this.colorModelChange.emit(this.colorPickerService.getColor());
        });
    }

    ngOnDestroy(): void {
        this.colorChangedSubscription.unsubscribe();
    }

    onColorPreviewClick(): void {
        this.colorPreviewClicked.emit();
    }

    get color(): Color {
        return this.colorPickerService.getColor();
    }
}
