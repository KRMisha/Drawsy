import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-calligraphy',
    templateUrl: './guide-calligraphy.component.html',
    styleUrls: ['../../../shared.scss', './guide-calligraphy.component.scss'],
})
export class GuideCalligraphyComponent implements GuideContent {}
