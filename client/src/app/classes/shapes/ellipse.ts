import { Shape } from './shape';

export class Ellipse extends Shape {
    render(): string {
        return '<ellipse cx="200" cy="80" rx="100" ry="50"';
    }
}
