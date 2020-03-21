import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-select',
    templateUrl: './guide-select.component.html',
    styleUrls: ['../../common.scss', './guide-select.component.scss'],
})
export class GuideSelectComponent implements GuideContent {}
