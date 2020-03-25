import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-color',
    templateUrl: './guide-color.component.html',
    styleUrls: ['../../shared.scss', './guide-color.component.scss'],
})
export class GuideColorComponent implements GuideContent {}
