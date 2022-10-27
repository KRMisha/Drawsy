import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { SimplificationSettings } from '@app/tools/classes/simplification-settings';
import { SmoothingSettings } from '@app/tools/classes/smoothing-settings';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';

export default {
    defaultLineWidth: 5,
    defaultBrushTexture: BrushTexture.Graffiti,
    defaultJunctionSettings: { isEnabled: false, diameter: 10 } as JunctionSettings,
    defaultSprayDiameter: 50,
    defaultSprayRate: 25,
    defaultShapeType: ShapeType.FillWithBorder,
    defaultShapeBorderWidth: 5,
    defaultPolygonSideCount: 6,
    defaultFillDeviation: 5,
    defaultEraserSize: 5,
    defaultSmoothingSettings: { isEnabled: true, factor: 20 } as SmoothingSettings,
    defaultSimplificationSettings: { isEnabled: true, threshold: 5 } as SimplificationSettings,
};
