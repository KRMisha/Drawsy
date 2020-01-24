import { Shape } from './shape';

export class Rectangle implements Shape {
    render(): string {
        return `<rect width="100%" height="100%" fill="red" />`;
    }
}
