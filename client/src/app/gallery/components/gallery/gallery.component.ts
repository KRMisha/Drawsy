import { Component } from '@angular/core';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
    links: string[] = [
        './../../../../../assets/Drawings/Kirby.svg',
        './../../../../assets/Drawings/Milk and wine.svg',
        './../../../../assets/Drawings/Unicorn.svg',
        './../../../../assets/Drawings/Windows logo.svg',
    ];
}
