import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-select',
    templateUrl: './guide-select.component.html',
    styleUrls: ['./guide-select.component.scss'],
})
export class GuideSelectComponent implements GuideContent {}
