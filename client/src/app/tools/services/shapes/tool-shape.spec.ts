import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
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
