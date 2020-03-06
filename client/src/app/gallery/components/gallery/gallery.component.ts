import { Component } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';
import { GalleryService } from '@app/gallery/services/gallery/gallery.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
    containers: SvgFileContainer[];

    constructor(private galleryService: GalleryService) {}

    createSvgFileContainer(files: FileList): void {
        this.galleryService.createSvgFileContainer(files);
        this.containers = this.galleryService.containers;
    }
}
