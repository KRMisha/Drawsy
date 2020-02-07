import { Component, CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { GuideService } from '../../services/guide/guide.service';
import { GuideDirective } from './guide-directive/guide.directive';
import { GuideComponent } from './guide.component';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
    selector: 'app-guide-welcome',
    template: '<p>Mock Welcome Guide</p>'
})
class MockGuideWelcomeComponent {}

describe('GuideComponent', () => {
    const MockGuides: Type<any>[] = [
        MockGuideWelcomeComponent,
        MockGuideWelcomeComponent
    ];
    let component: GuideComponent;
    let fixture: ComponentFixture<GuideComponent>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GuideComponent>>;
    // let guideServiceSpyObj: jasmine.SpyObj<GuideService>;

    // let componentFactoryResolverSpyObj: jasmine.SpyObj<ComponentFactoryResolver>;
    beforeEach(async () => {
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });

        const InjectedguideServiceSpyObj = jasmine.createSpyObj({getGuides: MockGuides});
        TestBed.configureTestingModule({
            imports: [MatIconModule, MatDialogModule],
            declarations: [GuideComponent, MockGuideWelcomeComponent, GuideDirective],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpyObj },
                { provide: GuideService, useValue: InjectedguideServiceSpyObj }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).overrideModule( BrowserDynamicTestingModule,
                        { set: { entryComponents: [MockGuideWelcomeComponent]}})
        .compileComponents();

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // guideServiceSpyObj = TestBed.get(GuideService);
        // guideServiceSpyObj.getGuides.and.returnValue(MockGuides);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
