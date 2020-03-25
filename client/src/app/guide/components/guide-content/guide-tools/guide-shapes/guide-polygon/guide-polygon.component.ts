import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-polygon',
    templateUrl: './guide-polygon.component.html',
    styleUrls: ['../../../shared.scss', './guide-polygon.component.scss'],
})
export class GuidePolygonComponent implements GuideContent {}
