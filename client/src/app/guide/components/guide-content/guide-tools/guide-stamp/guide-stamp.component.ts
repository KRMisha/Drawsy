import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-stamp',
    templateUrl: './guide-stamp.component.html',
    styleUrls: ['./guide-stamp.component.scss'],
})
export class GuideStampComponent implements GuideContent {}
