import { async, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '@app/app/components/app/app.component';
import { ThemeService } from '@app/app/services/theme.service';
import { ModalService } from '@app/modals/services/modal.service';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
    let component: AppComponent;

    beforeEach(async(() => {
        const iconRegistrySpyObj = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
        const sanitizerSpyObj = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
        const modalServiceStub = {};
        const shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            openNewDrawingShortcut$: new Subject<void>(),
            openGalleryShortcut$: new Subject<void>(),
        });
        const themeServiceStub = {};

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            providers: [
                { provide: MatIconRegistry, useValue: iconRegistrySpyObj },
                { provide: DomSanitizer, useValue: sanitizerSpyObj },
                { provide: ModalService, useValue: modalServiceStub },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
                { provide: ThemeService, useValue: themeServiceStub },
            ],
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
