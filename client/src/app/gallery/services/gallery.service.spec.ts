import { TestBed } from '@angular/core/testing';
import { GalleryService } from '@app/gallery/services/gallery.service';

describe('GalleryService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GalleryService = TestBed.inject(GalleryService);
        expect(service).toBeTruthy();
    });
});
