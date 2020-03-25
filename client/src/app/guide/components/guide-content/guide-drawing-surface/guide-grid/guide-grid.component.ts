import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-grid',
    templateUrl: './guide-grid.component.html',
    styleUrls: ['../../shared.scss', './guide-grid.component.scss'],
})
export class GuideGridComponent implements GuideContent {}
