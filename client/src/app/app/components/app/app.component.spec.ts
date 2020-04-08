import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from '@app/app/components/app/app.component';
import { ThemeService } from '@app/app/services/theme.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';

import { Subject } from 'rxjs';

// tslint:disable: max-classes-per-file
// tslint:disable: no-string-literal

describe('AppComponent', () => {
    let component: AppComponent;
    let iconRegistrySpyObj: jasmine.SpyObj<MatIconRegistry>;
    let sanitizerSpyObj: jasmine.SpyObj<DomSanitizer>;
    let modalServiceSpyObject: jasmine.SpyObj<ModalService>;
    let shortcutServiceSpyObject: jasmine.SpyObj<ShortcutService>;
    let themeServiceSpyObject: jasmine.SpyObj<ThemeService>;
    let openNewDrawingShortcutSubject: Subject<void>;
    let openGalleryShortcutSubject: Subject<void>;
    const initialTheme = 'initialTheme';

    beforeEach(async(() => {
        iconRegistrySpyObj = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
        sanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

        modalServiceSpyObject = jasmine.createSpyObj('ModalService', ['openNewDrawingModal', 'openGalleryModal']);
        openNewDrawingShortcutSubject = new Subject<void>();
        openGalleryShortcutSubject = new Subject<void>();
        shortcutServiceSpyObject = jasmine.createSpyObj('ShortcutService', ['onKeyDown'], {
            openNewDrawingShortcut$: openNewDrawingShortcutSubject,
            openGalleryShortcut$: openGalleryShortcutSubject,
        });
        themeServiceSpyObject = jasmine.createSpyObj('ThemeService', [], { theme: initialTheme });

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
                { provide: MatIconRegistry, useValue: iconRegistrySpyObj },
                { provide: DomSanitizer, useValue: sanitizerSpyObj },
                { provide: ModalService, useValue: modalServiceSpyObject },
                { provide: ShortcutService, useValue: shortcutServiceSpyObject },
                { provide: ThemeService, useValue: themeServiceSpyObject },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        const fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should call iconRegistry's addSvgIcon for each icon name (29)", () => {
        // tslint:disable-next-line: no-magic-numbers
        expect(iconRegistrySpyObj.addSvgIcon).toHaveBeenCalledTimes(29);
    });

    it("#ngOnInit should subscribe to shortcutService's openNewDrawingShortcut and openGalleryShortcut", async(() => {
        component.ngOnInit();
        openGalleryShortcutSubject.next();
        openNewDrawingShortcutSubject.next();
        expect(modalServiceSpyObject.openGalleryModal).toHaveBeenCalled();
        expect(modalServiceSpyObject.openNewDrawingModal).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from its subscriptions', async(() => {
        component.ngOnInit();
        // tslint:disable: no-any
        const newDrawingShortcutSubscriptionSpy = spyOn<any>(component['newDrawingShortcutSubscription'], 'unsubscribe');
        const galleryShortcutSubscriptionSpy = spyOn<any>(component['galleryShortcutSubscription'], 'unsubscribe');
        // tslint:enable: no-any
        component.ngOnDestroy();
        expect(newDrawingShortcutSubscriptionSpy).toHaveBeenCalled();
        expect(galleryShortcutSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#onRightClick should prevent the default behaviour', () => {
        const event = new MouseEvent('');
        spyOn(event, 'preventDefault').and.callThrough();
        component.onRightClick(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('#onKeyDown should forward the call to the shortcutService', () => {
        const event = { key: 'o', ctrlKey: false } as KeyboardEvent;
        component.onKeyDown(event);
        expect(shortcutServiceSpyObject.onKeyDown).toHaveBeenCalledWith(event);
    });

    it("#onFocusIn should disable shortcuts if the event's target is an instance of HTMLInputElement ", () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('input');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(false);
    });

    it("#onFocusIn should disable shortcuts if the event's target is an instance of HTMLTextAreaElement", () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('textarea');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(false);
    });

    // tslint:disable-next-line: max-line-length
    it("#onFocusIn should not disable shortcuts if the event's target is not an instance of HTMLTextAreaElement or HTMLInputElement", () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('anchor');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(true);
    });

    it("#onFocusOut should enable shortcuts if the event's target is an instance of HTMLInputElement ", () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('input');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(true);
    });

    it("#onFocusOut should enable shortcuts if the event's target is an instance of HTMLTextAreaElement", () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('textarea');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(true);
    });

    // tslint:disable-next-line: max-line-length
    it("#onFocusOut should not enable shortcuts if the event's target is not an instance of HTMLTextAreaElement or HTMLInputElement", () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('anchor');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toEqual(false);
    });

    it("#get Theme should return themeService's theme", () => {
        const returnValue = component.theme;
        expect(themeServiceSpyObject.theme).toEqual(returnValue);
    });
});
