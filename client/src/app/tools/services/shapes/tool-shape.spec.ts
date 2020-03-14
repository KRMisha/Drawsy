// import { Color } from '@app/classes/color';
// import { Rect } from '@app/classes/rect';
// import { Vec2 } from '@app/classes/vec2';
// import { AppendElementCommand } from '@app/drawing/classes/commands/append-element-command';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
// import { GeometryService } from '@app/drawing/services/geometry.service';
// import { ButtonId } from '@app/editor/enums/button-id.enum';
// import ToolDefaults from '@app/tools/enums/tool-defaults';
// import { ToolName } from '@app/tools/enums/tool-name.enum';
// import { ToolSetting } from '@app/tools/enums/tool-settings.enum';
// import { Tool } from '@app/tools/services/tool';
// import { ToolShape } from './tool-shape';

describe('Shape', () => {
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorService: ColorService;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;
    // const name: ToolName = ToolName.Brush;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement']);
        colorService = {} as ColorService;
        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);
    });
    it('should create an instance', () => {
        // expect().toBeTruthy();
    });
});
