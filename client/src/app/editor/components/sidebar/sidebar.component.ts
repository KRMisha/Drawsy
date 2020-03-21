import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { CommandService } from '@app/drawing/services/command.service';
import { SidebarButton, sidebarButtons } from '@app/editor/classes/sidebar-button';
import { ShortcutService } from '@app/editor/services/shortcut.service';
import { ModalService } from '@app/modals/services/modal.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    @ViewChild('appDrawer') drawer: MatDrawer;

    buttons: SidebarButton[] = sidebarButtons;
    selectedButton: SidebarButton = this.buttons[0];

    private selectToolPencilShortcutSubscription: Subscription;
    private selectToolPaintbrushShortcutSubscription: Subscription;
    private selectToolLineShortcutSubscription: Subscription;
    private selectToolSprayCanShortcutSubscription: Subscription;
    private selectToolRectangleShortcutSubscription: Subscription;
    private selectToolEllipseShortcutSubscription: Subscription;
    private selectToolPolygonShortcutSubscription: Subscription;
    private selectToolEyedropperShortcutSubscription: Subscription;
    private selectToolRecolorShortcutSubscription: Subscription;
    private selectToolSelectionShortcutSubscription: Subscription;
    private selectToolEraserShortcutSubscription: Subscription;
    private exportDrawingShortcutSubscription: Subscription;
    private saveDrawingShortcutSubscription: Subscription;
    private undoShortcutSubscription: Subscription;
    private redoShortcutSubscription: Subscription;

    constructor(
        private currentToolService: CurrentToolService,
        private modalService: ModalService,
        private commandService: CommandService,
        private shortcutService: ShortcutService
    ) {}

    ngOnInit(): void {
        this.currentToolService.setSelectedTool(this.selectedButton.toolIndex);

        this.selectToolPencilShortcutSubscription = this.shortcutService.selectToolPencilShortcut$.subscribe(() => {
            this.setSelectedTool(0);
        });
        this.selectToolPaintbrushShortcutSubscription = this.shortcutService.selectToolPaintbrushShortcut$.subscribe(() => {
            this.setSelectedTool(1);
        });
        this.selectToolLineShortcutSubscription = this.shortcutService.selectToolLineShortcut$.subscribe(() => {
            this.setSelectedTool(2);
        });
        this.selectToolSprayCanShortcutSubscription = this.shortcutService.selectToolSprayCanShortcut$.subscribe(() => {
            this.setSelectedTool(3); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolRectangleShortcutSubscription = this.shortcutService.selectToolRectangleShortcut$.subscribe(() => {
            this.setSelectedTool(4); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolEllipseShortcutSubscription = this.shortcutService.selectToolEllipseShortcut$.subscribe(() => {
            this.setSelectedTool(5); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolPolygonShortcutSubscription = this.shortcutService.selectToolPolygonShortcut$.subscribe(() => {
            this.setSelectedTool(6); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolEyedropperShortcutSubscription = this.shortcutService.selectToolEyedropperShortcut$.subscribe(() => {
            this.setSelectedTool(7); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolRecolorShortcutSubscription = this.shortcutService.selectToolRecoloShortcut$.subscribe(() => {
            this.setSelectedTool(8); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolSelectionShortcutSubscription = this.shortcutService.selectToolSelectionShortcut$.subscribe(() => {
            this.setSelectedTool(9); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolEraserShortcutSubscription = this.shortcutService.selectToolEraserShortcut$.subscribe(() => {
            this.setSelectedTool(10); // tslint:disable-line: no-magic-numbers
        });
        this.exportDrawingShortcutSubscription = this.shortcutService.openExportDrawingShortcut$.subscribe(() => {
            this.openExportModal();
        });
        this.saveDrawingShortcutSubscription = this.shortcutService.openSaveDrawingShortcut$.subscribe(() => {
            this.openSaveModal();
        });
        this.undoShortcutSubscription = this.shortcutService.undoShortcut$.subscribe(() => {
            this.undo();
        });
        this.redoShortcutSubscription = this.shortcutService.redoShortcut$.subscribe(() => {
            this.redo();
        });
    }

    ngOnDestroy(): void {
        this.selectToolPencilShortcutSubscription.unsubscribe();
        this.selectToolPaintbrushShortcutSubscription.unsubscribe();
        this.selectToolLineShortcutSubscription.unsubscribe();
        this.selectToolSprayCanShortcutSubscription.unsubscribe();
        this.selectToolRectangleShortcutSubscription.unsubscribe();
        this.selectToolEllipseShortcutSubscription.unsubscribe();
        this.selectToolPolygonShortcutSubscription.unsubscribe();
        this.selectToolEyedropperShortcutSubscription.unsubscribe();
        this.selectToolRecolorShortcutSubscription.unsubscribe();
        this.selectToolSelectionShortcutSubscription.unsubscribe();
        this.selectToolEraserShortcutSubscription.unsubscribe();
        this.exportDrawingShortcutSubscription.unsubscribe();
        this.saveDrawingShortcutSubscription.unsubscribe();
        this.undoShortcutSubscription.unsubscribe();
        this.redoShortcutSubscription.unsubscribe();
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.buttons.length) {
            return;
        }
        this.drawer.open();
        this.selectedButton = this.buttons[toolIndex];
        this.currentToolService.setSelectedTool(toolIndex);
    }

    openSettingsModal(): void {
        this.modalService.openSettingsModal();
    }

    openExportModal(): void {
        this.modalService.openExportModal();
    }

    openSaveModal(): void {
        this.modalService.openSaveModal();
    }

    openNewDrawingModal(): void {
        this.modalService.openNewDrawingModal();
    }

    openGuideModal(): void {
        this.modalService.openGuideModal();
    }

    openGalleryModal(): void {
        this.modalService.openGalleryModal();
    }

    undo(): void {
        this.commandService.undo();
        this.currentToolService.selectedTool.onToolDeselection();
    }

    redo(): void {
        this.commandService.redo();
        this.currentToolService.selectedTool.onToolDeselection();
    }
}
