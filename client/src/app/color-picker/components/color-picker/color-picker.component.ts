import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { combineLatest, Subscription } from 'rxjs';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    providers: [ColorPickerService],
})
export class ColorPickerComponent implements OnInit, OnDestroy {
    @Input()
    set colorModel(color: Color) {
        this.colorPickerService.setColor(color);
    }
    @Input() colorPreviewTooltip = '';
    @Output() colorModelChange = new EventEmitter<Color>();
    @Output() colorPreviewClicked = new EventEmitter<void>();

    private colorChangedSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {}

    ngOnInit(): void {
        this.colorChangedSubscription = combineLatest([
            this.colorPickerService.hueChanged$,
            this.colorPickerService.saturationChanged$,
            this.colorPickerService.valueChanged$,
            this.colorPickerService.alphaChanged$,
        ]).subscribe(() => {
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
