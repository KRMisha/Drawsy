import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-export-drawing',
    templateUrl: './guide-export-drawing.component.html',
    styleUrls: ['./guide-export-drawing.component.scss'],
})
export class GuideExportDrawingComponent implements GuideContent {}
