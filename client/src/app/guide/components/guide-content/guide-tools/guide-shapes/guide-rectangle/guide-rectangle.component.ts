import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-rectangle',
    templateUrl: './guide-rectangle.component.html',
    styleUrls: ['../../../common.scss', './guide-rectangle.component.scss'],
})
export class GuideRectangleComponent implements GuideContent {}
