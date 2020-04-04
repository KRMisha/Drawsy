import { JunctionSettings } from '@app/tools/classes/junction-settings';
import { BrushTexture } from '@app/tools/enums/brush-texture.enum';
import { ShapeType } from '@app/tools/enums/shape-type.enum';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';

type RestrictedToolSettingType<T extends ToolSetting> = T extends ToolSetting.LineWidth
    ? number
    : T extends ToolSetting.BrushTexture
    ? BrushTexture
    : T extends ToolSetting.JunctionSettings
    ? JunctionSettings
    : T extends ToolSetting.SprayDiameter
    ? number
    : T extends ToolSetting.SprayRate
    ? number
    : T extends ToolSetting.ShapeType
    ? ShapeType
    : T extends ToolSetting.ShapeBorderWidth
    ? number
    : T extends ToolSetting.PolygonSideCount
    ? number
    : T extends ToolSetting.FillDeviation
    ? number
    : T extends ToolSetting.EraserSize
    ? number
    : never;

export type ToolSettings = {
    [setting in ToolSetting]?: RestrictedToolSettingType<setting>;
};
