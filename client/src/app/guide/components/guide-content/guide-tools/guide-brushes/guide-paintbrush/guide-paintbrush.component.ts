import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-paintbrush',
    templateUrl: './guide-paintbrush.component.html',
    styleUrls: ['../../../shared.scss', './guide-paintbrush.component.scss'],
})
export class GuidePaintbrushComponent implements GuideContent {}
