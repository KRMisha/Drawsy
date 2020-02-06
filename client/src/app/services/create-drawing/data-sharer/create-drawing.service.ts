import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from '../../../classes/color/color';

@Injectable({
    providedIn: 'root',
})
export class CreateDrawingService {
    private height = new Subject<number>();
    private width = new Subject<number>();
    private color = new Subject<Color>();

    height$ = this.height.asObservable();
    width$ = this.width.asObservable();
    color$ = this.color.asObservable();

    changeWidth(width: number) {
        this.width.next(width);
    }

    changeHeight(height: number) {
        this.height.next(height);
    }

    changeColor(color: Color) {
        this.color.next(color);
    }
}
