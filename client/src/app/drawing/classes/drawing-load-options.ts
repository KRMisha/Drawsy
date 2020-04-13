import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

interface DrawingData {
    id?: string;
    title: string;
    labels: string[];
    elements: SVGGraphicsElement[];
}

export interface DrawingLoadOptions {
    dimensions: Vec2;
    backgroundColor: Color;
    drawingData?: DrawingData;
}
