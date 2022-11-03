import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { SmoothingSettings } from '@app/tools/classes/smoothing-settings';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';

export default {
    defaultLineWidth: 5,
    defaultSmoothingSettings: { isEnabled: true, factor: 10 } as SmoothingSettings,
    defaultBrushTexture: BrushTexture.Graffiti,
    defaultJunctionSettings: { isEnabled: false, diameter: 10 } as JunctionSettings,
    defaultSprayDiameter: 50,
    defaultSprayRate: 25,
    defaultShapeType: ShapeType.FillWithBorder,
    defaultShapeBorderWidth: 5,
    defaultPolygonSideCount: 6,
    defaultFillDeviation: 5,
    defaultEraserSize: 5,
};
