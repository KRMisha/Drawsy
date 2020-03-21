import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-welcome',
    templateUrl: './guide-welcome.component.html',
    styleUrls: ['../common.scss', './guide-welcome.component.scss'],
})
export class GuideWelcomeComponent implements GuideContent {}
