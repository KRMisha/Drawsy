import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-fill',
    templateUrl: './guide-fill.component.html',
    styleUrls: ['../../shared.scss', './guide-fill.component.scss'],
})
export class GuideFillComponent implements GuideContent {}
