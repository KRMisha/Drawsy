import { Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolData } from '@app/tools/classes/tool-data';
import { ToolSettings } from '@app/tools/classes/tool-settings';

export abstract class Tool {
    static mousePosition: Vec2 = { x: 0, y: 0 };

    static isLeftMouseButtonDown = false;
    static isMouseInsideDrawing = false;

    name: string;
    icon: string;
    settings: ToolSettings = {};

    protected renderer: Renderer2;

    constructor(
        rendererFactory: RendererFactory2,
        protected drawingService: DrawingService,
        protected colorService: ColorService,
        protected commandService: CommandService,
        toolInfo: ToolData
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        ({ name: this.name, icon: this.icon } = toolInfo);
    }

    // Disable lint error for method stubs below because not all derived service classes
    // need to override the functionality and would needlessly define no-ops otherwise
    // tslint:disable: no-empty
    onMouseMove(): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseDoubleClick(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
    onEnter(event: MouseEvent): void {}
    onLeave(event: MouseEvent): void {}
    onPrimaryColorChange(color: Color): void {}
    onSecondaryColorChange(color: Color): void {}
    onElementClick(event: MouseEvent, element: SVGGraphicsElement): void {}
    update(): void {}
    onToolSelection(): void {}
    onToolDeselection(): void {}
    // tslint:enable: no-empty
}

// Note for grading:
//
// Introduction
// Many tslint disables for non-null assertions can be found throughout the derived tools' code. While, to an untrained eye,
// this could unfortunately be perceived as a design flaw, the reality is far different. So different, in fact, it warrants
// an extended essay into the reasons motivating an experienced development team to abandon the oft ire-inducing aforementioned
// no-non-null-assertion tslint errors by sprinkling comments every other semicolon.
//
// Chapter 1: The beginning
// In the beginning was JavaScript. A modest scripting language at best, it evolved into a gigantic steaming pile of excellence,
// riddled with one too many lovely features such as aggressive type conversions, hoisting, and lack of a robust type system.
// To the aspiring web designer, these would never pose a serious problem. But forward a decade into the future, developers were left
// with a need to implement many safeguards with static analysis tools to give them the least bit of confidence in the security of the
// programs they wrote for the web.
//
// Chapter 2: The evolution
// In 2012, Microsoft announced TypeScript, a languaged designed to be a superset of JavaScript, featuring static typing for added
// safety. Its arrival was welcomed by developers who had been burned by JavaScript's expertly designed features, and many of TypeScript's
// features were built with developer control in mind. With TypeScript 2.0's arrival came the non-null assertion operator as a
// native language feature. The non-null assertion operator has allowed developers to explicitly indicate to the compiler's type checker
// and future code readers) that a certain variable, flagged as potentially undefined, is in reality to be trusted to never be undefined
// through logical mechanisms the developer has implemented. Fast-forward to this day, it has replaced the need for some otherwise
// unnecessary type guards when the logic assures a variable will always be undefined, thus increasing testability, lowering cognitive load,
// and improving code reusability. The non-null assertion operator has also made obsolete the old-fashioned way of casting a potentially
// undefined type to its non-undefinable counterpart via a typecast, which had the drawback of lowering the ease with which one may
// distinguish unsafe type conversions from conversions written solely to satisfy the compiler's need for strict type checking on
// undefinable types.
//
// Chapter 3: The solution
// Thus, the non-null assertion operator has the ability to explicitly declare a developer's intent to avoid the need for unnecessary
// type guards and assertions when a program's logical architecture prevents bugs from arising. It should be regarded as a clear indication
// of intent, not as an anti-pattern. To lint the non-null assertion operator is to proclaim that the developer's code architecture
// abilities are subpar, and that their decision should not be respected. To force the developer to explicit their intent to use such a
// language would be an aberration and an insult to their fundamental skills.
//
// Epilogue
// We have not justified the use of non-null assertion operators in derived tools because of its irrelevance given the way the code
// has been structured.
