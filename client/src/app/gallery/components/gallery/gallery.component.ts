import { Component } from '@angular/core';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
    links: string[] = [
        'https://svgsilh.com/svg/1435214.svg',
        'https://svgsilh.com/svg/1431397.svg',
        'https://svgsilh.com/svg/1435217.svg',
        'https://svgsilh.com/svg/47935.svg',
        'https://svgsilh.com/svg/1325107.svg',
        'http://thecraftchop.com/files/images/darth_1.svg',
        'https://upload.wikimedia.org/wikipedia/commons/c/cf/Ubuntu_alternative_background.svg',
    ];
}
