import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionButton } from '@app/editor/classes/action-button';
import { ToolButton } from '@app/editor/classes/tool-button';
import { ShortcutService } from '@app/editor/services/shortcut.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ToolName } from '@app/tools/enums/tool-name.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    readonly toolButtons: ToolButton[] = [
        { name: ToolName.Pencil, icon: 'create', toolIndex: 0 },
        { name: ToolName.Brush, icon: 'brush', toolIndex: 1 },
        { name: ToolName.Line, icon: 'timeline', toolIndex: 2 },
        { name: ToolName.SprayCan, icon: 'blur_on', toolIndex: 3 },
        { name: ToolName.Rectangle, icon: 'crop_5_4', toolIndex: 4 },
        { name: ToolName.Ellipse, icon: 'panorama_fish_eye', toolIndex: 5 },
        { name: ToolName.Polygon, icon: 'star', toolIndex: 6 },
        { name: ToolName.Eyedropper, icon: 'colorize', toolIndex: 7 },
        { name: ToolName.Recolor, icon: 'format_paint', toolIndex: 8 },
        { name: ToolName.Selection, icon: 'select_all', toolIndex: 9 },
        { name: ToolName.Eraser, icon: 'delete_sweep', toolIndex: 10 },
    ];

    readonly actionButtons: ActionButton[] = [
        { name: 'Nouveau dessin', icon: 'add', action: this.openNewDrawingModal.bind(this) },
        { name: 'Exporter le dessin localement', icon: 'save_alt', action: this.openExportDrawingModal.bind(this) },
        { name: 'Sauvegarder le dessin sur le serveur', icon: 'cloud_upload', action: this.openSaveDrawingModal.bind(this) },
        { name: 'Galerie de dessins', icon: 'collections', action: this.openGalleryModal.bind(this) },
        { name: 'Paramètres', icon: 'settings', action: this.openSettingsModal.bind(this) },
        { name: 'Guide', icon: 'help_outline', action: this.openGuideModal.bind(this) },
        { name: 'Accueil', icon: 'home', action: this.navigateToHome.bind(this) },
    ];

    selectedToolIndex = 0;

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

    constructor(
        private router: Router,
        private currentToolService: CurrentToolService,
        private modalService: ModalService,
        private shortcutService: ShortcutService
    ) {}

    ngOnInit(): void {
        this.currentToolService.setSelectedTool(this.selectedToolIndex);

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
        this.selectToolRecolorShortcutSubscription = this.shortcutService.selectToolRecolorShortcut$.subscribe(() => {
            this.setSelectedTool(8); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolSelectionShortcutSubscription = this.shortcutService.selectToolSelectionShortcut$.subscribe(() => {
            this.setSelectedTool(9); // tslint:disable-line: no-magic-numbers
        });
        this.selectToolEraserShortcutSubscription = this.shortcutService.selectToolEraserShortcut$.subscribe(() => {
            this.setSelectedTool(10); // tslint:disable-line: no-magic-numbers
        });
        this.exportDrawingShortcutSubscription = this.shortcutService.openExportDrawingShortcut$.subscribe(() => {
            this.openExportDrawingModal();
        });
        this.saveDrawingShortcutSubscription = this.shortcutService.openSaveDrawingShortcut$.subscribe(() => {
            this.openSaveDrawingModal();
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
    }

    setSelectedTool(toolIndex: number): void {
        if (toolIndex < 0 || toolIndex >= this.toolButtons.length) {
            return;
        }
        this.selectedToolIndex = toolIndex;
        this.currentToolService.setSelectedTool(toolIndex);
    }

    openNewDrawingModal(): void {
        this.modalService.openNewDrawingModal();
    }

    openExportDrawingModal(): void {
        this.modalService.openExportDrawingModal();
    }

    openSaveDrawingModal(): void {
        this.modalService.openSaveDrawingModal();
    }

    openGalleryModal(): void {
        this.modalService.openGalleryModal();
    }

    openSettingsModal(): void {
        this.modalService.openSettingsModal();
    }

    openGuideModal(): void {
        this.modalService.openGuideModal();
    }

    navigateToHome(): void {
        this.router.navigate(['/home']);
    }
}
