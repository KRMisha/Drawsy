import { FormControl } from '@angular/forms';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';

export interface SizeFormControlContainer {
    formControl: FormControl;
    toolSetting: ToolSetting;
    title: string;
    suffix: string;
    minimum: number;
    maximum: number;
}
