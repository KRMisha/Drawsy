import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-ellipse',
    templateUrl: './guide-ellipse.component.html',
    styleUrls: ['./guide-ellipse.component.scss'],
})
export class GuideEllipseComponent implements GuideContent {}
