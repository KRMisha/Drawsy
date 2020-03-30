import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommandService } from '@app/drawing/services/command.service';
import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { ToolSettings } from '@app/tools/classes/tool-settings';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Tool } from '@app/tools/services/tool';
import { Subject } from 'rxjs';

// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

fdescribe('SidebarDrawerComponent', () => {
    let component: SidebarDrawerComponent;
    let fixture: ComponentFixture<SidebarDrawerComponent>;

    let iconRegistrySpyObj: jasmine.SpyObj<MatIconRegistry>;
    let sanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;
    let currentToolServiceSpyObj: jasmine.SpyObj<CurrentToolService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;

    let undoShortcutSubject: Subject<void>;
    let redoShortcutSubject: Subject<void>;

    const toolName = 'Pinceau';
    const toolSettings = {} as ToolSettings;

    beforeEach(async(() => {
        iconRegistrySpyObj = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
        sanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
        currentToolServiceSpyObj = jasmine.createSpyObj('CurrentToolService', ['update'], {
            currentTool: { name: toolName, settings: toolSettings } as Tool,
        });
        undoShortcutSubject = new Subject<void>();
        redoShortcutSubject = new Subject<void>();
        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            undoShortcut$: undoShortcutSubject,
            redoShortcut$: redoShortcutSubject,
        });
        commandServiceSpyObj = jasmine.createSpyObj('CommandService', [
            'undo',
            'redo',
            'hasUndoCommands',
            'hasRedoCommands',
        ]);

        TestBed.configureTestingModule({
            declarations: [SidebarDrawerComponent],
            imports: [BrowserAnimationsModule, MatSliderModule, MatCheckboxModule, FormsModule, MatSelectModule],
            providers: [
                { provide: MatIconRegistry, useValue: iconRegistrySpyObj },
                { provide: DomSanitizer, useValue: sanitizerSpyObj},
                { provide: CurrentToolService, useValue: currentToolServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarDrawerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
