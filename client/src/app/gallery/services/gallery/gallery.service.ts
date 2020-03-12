import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    // tslint:disable-next-line: variable-name
    private _containers: SvgFileContainer[] = [];
    get containers(): SvgFileContainer[] {
        return this._containers;
    }
}
