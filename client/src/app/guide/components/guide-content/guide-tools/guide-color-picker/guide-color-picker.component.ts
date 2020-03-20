import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-color-picker',
    templateUrl: './guide-color-picker.component.html',
    styleUrls: ['../../common.scss', './guide-color-picker.component.scss'],
})
export class GuideColorPickerComponent implements GuideContent {}
