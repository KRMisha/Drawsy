import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-spray-paint',
    templateUrl: './guide-spray-paint.component.html',
    styleUrls: ['./guide-spray-paint.component.scss'],
})
export class GuideSprayPaintComponent implements GuideContent {}
