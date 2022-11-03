import { FormControl } from '@angular/forms';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';

export interface ToggleSliderFormControlContainer {
    toggleFormControl: FormControl;
    sliderFormControl: FormControl;
    toolSetting: ToolSetting;
    title: string;
    suffix: string;
    minimum: number;
    maximum: number;
}
