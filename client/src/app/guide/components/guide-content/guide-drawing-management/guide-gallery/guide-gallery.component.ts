import { Component } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

@Component({
    selector: 'app-guide-gallery',
    templateUrl: './guide-gallery.component.html',
    styleUrls: ['../../shared.scss', './guide-gallery.component.scss'],
})
export class GuideGalleryComponent implements GuideContent {}
