// tslint:disable: no-string-literal
// tslint:disable: max-classes-per-file

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from '@app/app/components/app/app.component';
import { ThemeService } from '@app/app/services/theme.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { Subject } from 'rxjs';

fdescribe('AppComponent', () => {
    let component: AppComponent;
    let modalServiceSpyObject: jasmine.SpyObj<ModalService>;
    let shortcutServiceSpyObject: jasmine.SpyObj<ShortcutService>;
    let themeServiceSpyObject: jasmine.SpyObj<ThemeService>;
    let openNewDrawingShortcutSubject: Subject<void>;
    let openGalleryShortcutSubject: Subject<void>;
    const initialTheme = 'initialTheme';

    beforeEach(async(() => {
        modalServiceSpyObject = jasmine.createSpyObj('ModalService', ['openNewDrawingModal', 'openGalleryModal']);
        openNewDrawingShortcutSubject = new Subject<void>();
        openGalleryShortcutSubject = new Subject<void>();
        shortcutServiceSpyObject = jasmine.createSpyObj('ShortcutService', [
            'onKeyDown',
        ], {
            openNewDrawingShortcut$: openNewDrawingShortcutSubject,
            openGalleryShortcut$: openGalleryShortcutSubject,
        });
        themeServiceSpyObject = jasmine.createSpyObj('ThemeService', [], { theme: initialTheme });

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
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

    it('#ngOnInit should subscribe to shortcutService\'s openNewDrawingShortcut and openGalleryShortcut', async(() => {
        component.ngOnInit();
        openGalleryShortcutSubject.next();
        expect(modalServiceSpyObject.openGalleryModal).toHaveBeenCalled();
        openNewDrawingShortcutSubject.next();
        expect(modalServiceSpyObject.openNewDrawingModal).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should call unsubscribe on the subscriptions', async(() => {
        component.ngOnInit();
        // tslint:disable: no-any
        const newDrawingShortcutSubscriptionSpy = spyOn<any>(component['newDrawingShortcutSubscription'], 'unsubscribe');
        const galleryShortcutSubscriptionSpy = spyOn<any>(component['galleryShortcutSubscription'], 'unsubscribe');
        // tslint:enable: no-any
        component.ngOnDestroy();
        expect(newDrawingShortcutSubscriptionSpy).toHaveBeenCalled();
        expect(galleryShortcutSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#onRightClick should prevent the default event', () => {
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

    it('#onFocusIn should set shorcutService\'s areShortcutsEnabled to false if the event\'s target is a HTMLInputElement ', () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('input');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeFalsy();
    });

    it('#onFocusIn should set shorcutService\'s areShortcutsEnabled to false if the event\'s target is a HTMLTextAreaElement', () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('textarea');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeFalsy();
    });

    it('#onFocusIn should not set shorcutService\'s areShortcutsEnabled to false if the event\'s target' +
     'is not a HTMLTextAreaElement or a HTMLInputElement', () => {
        const shortcutServiceMock = { areShortcutsEnabled: true } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('anchor');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusIn(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeTruthy();
    });

    it('#onFocusOut should set shorcutService\'s areShortcutsEnabled to true if the event\'s target is a HTMLInputElement ', () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('input');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeTruthy();
    });

    it('#onFocusOut should set shorcutService\'s areShortcutsEnabled to true if the event\'s target is a HTMLTextAreaElement', () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('textarea');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeTruthy();
    });

    it('#onFocusOut should not set shorcutService\'s areShortcutsEnabled to true if the event\'s target' +
     'is not a HTMLTextAreaElement or a HTMLInputElement', () => {
        const shortcutServiceMock = { areShortcutsEnabled: false } as ShortcutService;
        component['shortcutService'] = shortcutServiceMock;

        const targetElement = document.createElement('anchor');
        const event = ({ target: targetElement } as unknown) as FocusEvent;
        component.onFocusOut(event);
        expect(shortcutServiceMock.areShortcutsEnabled).toBeFalsy();
    });

    it('#get Theme should return themeService\'s theme', () => {
        const returnValue = component.theme;
        expect(returnValue).toEqual(themeServiceSpyObject.theme);
    });
});
