import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-selection',
    templateUrl: './guide-selection.component.html',
    styleUrls: ['../../shared.scss', './guide-selection.component.scss'],
})
export class GuideSelectionComponent implements GuideContent {}
