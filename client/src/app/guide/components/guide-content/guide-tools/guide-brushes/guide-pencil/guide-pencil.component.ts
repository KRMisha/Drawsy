import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-pencil',
    templateUrl: './guide-pencil.component.html',
    styleUrls: ['../../../shared.scss', './guide-pencil.component.scss'],
})
export class GuidePencilComponent implements GuideContent {}
