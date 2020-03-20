import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-text',
    templateUrl: './guide-text.component.html',
    styleUrls: ['../../common.scss', './guide-text.component.scss'],
})
export class GuideTextComponent implements GuideContent {}
