import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PencilService {
    pathBegin(x: number, y: number): string {
        return 'M' + String(x) + ' ' + String(y) + ' ' + 'L' + String(x) + ' ' + String(y) + ' ';
    }

    pathLine(x: number, y: number): string {
        return 'L' + String(x) + ' ' + String(y) + ' ';
    }
}
