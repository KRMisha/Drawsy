import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-line',
    templateUrl: './guide-line.component.html',
    styleUrls: ['../../common.scss', './guide-line.component.scss'],
})
export class GuideLineComponent implements GuideContent {}
