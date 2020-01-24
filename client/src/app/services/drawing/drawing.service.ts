import { Injectable } from '@angular/core';
import { Shape } from 'src/app/classes/shapes/shape';
// import { Rectangle } from 'src/app/classes/shapes/rectangle';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private shapes: Shape[];

    constructor() {
        this.shapes = [];
    }

    addShape(shape: Shape): void {
        this.shapes.push(shape);
    }

    getShapes(): Shape[] {
        return this.shapes;
    }
}