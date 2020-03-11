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
    parser = new DOMParser();
    // tslint:disable-next-line: variable-name
    private _containers: SvgFileContainer[] = [];
    get containers(): SvgFileContainer[] {
        return this._containers;
    }

    private addSvgFileContainer(file: File): void {
        const fileReader: FileReader = new FileReader();

        fileReader.onload = () => {
            const domParser = new DOMParser();
            const document = domParser.parseFromString(fileReader.result as string, 'image/svg+xml');
            const drawingRoot = document.getElementsByTagName('svg')[0];

            const title = drawingRoot.getElementsByTagName('title')[0].innerHTML;
            const labels = drawingRoot.getElementsByTagName('desc')[0].innerHTML.split(',');
            const link = window.URL.createObjectURL(file);
            // const link = domSanatizer.bypassSecuriyu
            this.containers.push({ title, labels, link, drawingRoot } as SvgFileContainer);
        };
        fileReader.readAsText(file);
    }

    createSvgFileContainer(files: FileList): void {
        for (let i = 0; i < files.length; i++) {
            this.addSvgFileContainer(files[i]);
        }
    }
}
