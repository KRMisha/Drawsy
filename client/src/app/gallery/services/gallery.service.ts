import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    private _containers: SvgFileContainer[] = []; // tslint:disable-line: variable-name
    get containers(): SvgFileContainer[] {
        return this._containers;
    }
}
