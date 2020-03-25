import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-save-drawing',
    templateUrl: './guide-save-drawing.component.html',
    styleUrls: ['../../shared.scss', './guide-save-drawing.component.scss'],
})
export class GuideSaveDrawingComponent implements GuideContent {}
