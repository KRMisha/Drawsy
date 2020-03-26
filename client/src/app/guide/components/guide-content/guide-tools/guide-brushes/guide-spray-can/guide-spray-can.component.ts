import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-spray-can',
    templateUrl: './guide-spray-can.component.html',
    styleUrls: ['../../../shared.scss', './guide-spray-can.component.scss'],
})
export class GuideSprayCanComponent implements GuideContent {}
