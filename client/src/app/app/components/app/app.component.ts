import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService } from '@app/editor/services/shortcut.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ThemeService } from '@app/app/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private newDrawingShortcutSubscription: Subscription;
    private galleryShortcutSubscription: Subscription;

    constructor(private modalService: ModalService, private shortcutService: ShortcutService, private themeService: ThemeService) {}

    ngOnInit(): void {
        this.newDrawingShortcutSubscription = this.shortcutService.openNewDrawingShortcut$.subscribe(() => {
            this.modalService.openNewDrawingModal();
        });
        this.galleryShortcutSubscription = this.shortcutService.openGalleryShortcut$.subscribe(() => {
            this.modalService.openGalleryModal();
        });
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
        return this.themeService.getTheme();
    }
}
