import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeService } from '@app/app/services/theme.service';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('background') private background: ElementRef<HTMLDivElement>;

    private newDrawingShortcutSubscription: Subscription;
    private galleryShortcutSubscription: Subscription;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private modalService: ModalService,
        private shortcutService: ShortcutService,
        private themeService: ThemeService
    ) {}

    ngOnInit(): void {
        const iconNames = [
            'brush',
            'card-plus-outline',
            'chart-timeline-variant',
            'checkbox-blank',
            'checkbox-blank-outline',
            'checkbox-intermediate',
            'cloud-upload-outline',
            'cog',
            'content-copy',
            'content-cut',
            'content-duplicate',
            'content-paste',
            'crop-square',
            'delete-outline',
            'download',
            'ellipse-outline',
            'eraser',
            'eyedropper-variant',
            'format-color-fill',
            'format-paint',
            'help-circle-outline',
            'hexagon-outline',
            'home',
            'image-multiple-outline',
            'pencil',
            'redo-variant',
            'selection',
            'spray',
            'undo-variant',
        ];

        for (const iconName of iconNames) {
            this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + iconName + '.svg'));
        }

        this.newDrawingShortcutSubscription = this.shortcutService.openNewDrawingShortcut$.subscribe(() => {
            this.modalService.openDialog(NewDrawingComponent);
        });
        this.galleryShortcutSubscription = this.shortcutService.openGalleryShortcut$.subscribe(() => {
            this.modalService.openDialog(GalleryComponent);
        });
    }

    ngAfterViewInit(): void {
        this.themeService.background = this.background;
    }

    ngOnDestroy(): void {
        this.newDrawingShortcutSubscription.unsubscribe();
        this.galleryShortcutSubscription.unsubscribe();
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.shortcutService.onKeyDown(event);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.shortcutService.onKeyUp(event);
    }

    @HostListener('document:focusin', ['$event'])
    onFocusIn(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            this.shortcutService.areShortcutsEnabled = false;
        }
    }

    @HostListener('document:focusout', ['$event'])
    onFocusOut(event: FocusEvent): void {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            this.shortcutService.areShortcutsEnabled = true;
        }
    }

    get theme(): string {
        return this.themeService.theme;
    }
}
