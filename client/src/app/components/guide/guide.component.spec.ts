import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { GuideService } from '../../services/guide/guide.service';
import { GuideSidebarComponent } from './guide-sidebar/guide-sidebar.component';
import { GuideComponent } from './guide.component';
import { GuideWelcomeComponent } from './guide-welcome/guide-welcome.component';
import { GuidePencilComponent } from './guide-pencil/guide-pencil.component';
import { GuideBrushComponent } from './guide-brush/guide-brush.component';
import { GuideLineComponent } from './guide-line/guide-line.component';
import { GuideRectangleComponent } from './guide-rectangle/guide-rectangle.component';
import { GuideColorComponent } from './guide-color/guide-color.component';
import { GuideSaveDrawingComponent } from './guide-save-drawing/guide-save-drawing.component';
import { GuideExportDrawingComponent } from './guide-export-drawing/guide-export-drawing.component';

@NgModule({
    declarations: [
        GuideWelcomeComponent,
        GuideBrushComponent,
        GuidePencilComponent,
        GuideLineComponent,
        GuideRectangleComponent,
        GuideColorComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
    ],
    entryComponents: [
        GuideWelcomeComponent,
        GuideBrushComponent,
        GuidePencilComponent,
        GuideLineComponent,
        GuideRectangleComponent,
        GuideColorComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
    ]
})
class GuideTestModule {}

describe('GuideComponent', () => {
    let component: GuideComponent;
    let fixture: ComponentFixture<GuideComponent>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<GuideComponent>>;

    // let componentFactoryResolverSpyObj: jasmine.SpyObj<ComponentFactoryResolver>;
    beforeEach(async () => {
        dialogRefSpyObj = jasmine.createSpyObj({
            afterClosed: of({}),
            afterOpened: of({}),
            open: null,
            close: null,
        });

        TestBed.configureTestingModule({
            imports: [MatIconModule, MatDialogModule, GuideTestModule],
            declarations: [GuideComponent, GuideSidebarComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpyObj },
                ComponentFactoryResolver,
                GuideService
            ],
        }).compileComponents();

        // componentFactoryResolverSpy = spyOn<any>(componentFactoryResolverSpy, 'resolveComponentFactory').and.returnValue();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
