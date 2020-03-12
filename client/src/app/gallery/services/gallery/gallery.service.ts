import { Injectable } from '@angular/core';
import { SvgFileContainer } from '@app/classes/svg-file-container';

// const links: string[] = [
//   './../../../../../assets/Drawings/Kirby.svg',
//   './../../../../assets/Drawings/Milk and wine.svg',
//   './../../../../assets/Drawings/Unicorn.svg',
//   './../../../../assets/Drawings/Windows logo.svg',
// ];

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
