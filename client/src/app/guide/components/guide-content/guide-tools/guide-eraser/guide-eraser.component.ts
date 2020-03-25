import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-eraser',
    templateUrl: './guide-eraser.component.html',
    styleUrls: ['../../shared.scss', './guide-eraser.component.scss'],
})
export class GuideEraserComponent implements GuideContent {}
