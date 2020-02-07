import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { hexRegexStr, Color } from 'src/app/classes/color/color';;

@Component({
  selector: 'app-color-hex-selector',
  templateUrl: './color-hex-selector.component.html',
  styleUrls: ['./color-hex-selector.component.scss']
})
export class ColorHexSelectorComponent implements OnInit {

    hexForm = new FormControl('000000', [Validators.required, Validators.pattern(hexRegexStr)]);
    @Output() colorChanged: EventEmitter<Color> = new EventEmitter();
    @Input()
    set hex(hex: string) {
        this.hexForm.setValue(hex);
    }

    ngOnInit() {
    }

    updateColorHex() {
        const color = new Color();
        if (color.setHex(this.hexForm.value)) {
            this.colorChanged.emit(color);
        }
    }

}
