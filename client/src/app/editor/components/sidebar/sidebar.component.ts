import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionButton } from '@app/editor/classes/action-button';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Tool } from '@app/tools/services/tool';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    readonly actionButtons: ActionButton[] = [
        { name: 'Nouveau dessin', icon: 'add', action: this.openNewDrawingModal.bind(this) },
        { name: 'Exporter le dessin localement', icon: 'save_alt', action: this.openExportDrawingModal.bind(this) },
        { name: 'Sauvegarder le dessin sur le serveur', icon: 'cloud_upload', action: this.openSaveDrawingModal.bind(this) },
        { name: 'Galerie de dessins', icon: 'collections', action: this.openGalleryModal.bind(this) },
        { name: 'Paramètres', icon: 'settings', action: this.openSettingsModal.bind(this) },
        { name: 'Guide', icon: 'help_outline', action: this.openGuideModal.bind(this) },
        { name: 'Accueil', icon: 'home', action: this.navigateToHome.bind(this) },
    ];

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
        private toolHolderService: ToolHolderService,
        private modalService: ModalService,
        private shortcutService: ShortcutService
    ) {}

    ngOnInit(): void {
        this.selectedTool = this.toolHolderService.tools[0];

        this.selectToolPencilShortcutSubscription = this.shortcutService.selectToolPencilShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolPencilService;
        });
        this.selectToolPaintbrushShortcutSubscription = this.shortcutService.selectToolPaintbrushShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolPaintbrushService;
        });
        this.selectToolLineShortcutSubscription = this.shortcutService.selectToolLineShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolLineService;
        });
        this.selectToolSprayCanShortcutSubscription = this.shortcutService.selectToolSprayCanShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolSprayCanService;
        });
        this.selectToolRectangleShortcutSubscription = this.shortcutService.selectToolRectangleShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolRectangleService;
        });
        this.selectToolEllipseShortcutSubscription = this.shortcutService.selectToolEllipseShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolEllipseService;
        });
        this.selectToolPolygonShortcutSubscription = this.shortcutService.selectToolPolygonShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolPolygonService;
        });
        this.selectToolEyedropperShortcutSubscription = this.shortcutService.selectToolEyedropperShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolEyedropperService;
        });
        this.selectToolRecolorShortcutSubscription = this.shortcutService.selectToolRecolorShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolRecolorService;
        });
        this.selectToolSelectionShortcutSubscription = this.shortcutService.selectToolSelectionShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolSelectionService;
        });
        this.selectToolEraserShortcutSubscription = this.shortcutService.selectToolEraserShortcut$.subscribe(() => {
            this.currentToolService.selectedTool = this.toolHolderService.toolEraserService;
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

    get tools(): Tool[] {
        return this.toolHolderService.tools;
    }

    get selectedTool(): Tool {
        return this.currentToolService.selectedTool;
    }

    set selectedTool(tool: Tool) {
        this.currentToolService.selectedTool = tool;
    }
}
