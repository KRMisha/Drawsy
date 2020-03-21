import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-snap-to-grid',
    templateUrl: './guide-snap-to-grid.component.html',
    styleUrls: ['../../common.scss', './guide-snap-to-grid.component.scss'],
})
export class GuideSnapToGridComponent implements GuideContent {}
