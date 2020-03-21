import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';

export default {
    defaultLineWidth: 5,
    defaultBrushTexture: BrushTexture.Graffiti,
    defaultJunctionSettings: { isEnabled: false, diameter: 10 } as JunctionSettings,
    defaultSprayDiameter: 20,
    defaultSprayRate: 20,
    defaultShapeType: ShapeType.FillWithBorder,
    defaultShapeBorderWidth: 5,
    defaultPolygonSideCount: 3,
    defaultEraserSize: 5,
};
