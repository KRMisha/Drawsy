import { ToolName } from '@app/tools/enums/tool-name.enum';

export interface ToolButton {
    name: ToolName;
    icon: string;
    toolIndex: number;
}
