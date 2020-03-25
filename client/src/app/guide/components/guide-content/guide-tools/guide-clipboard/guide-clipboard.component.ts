import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-clipboard',
    templateUrl: './guide-clipboard.component.html',
    styleUrls: ['../../shared.scss', './guide-clipboard.component.scss'],
})
export class GuideClipboardComponent implements GuideContent {}
