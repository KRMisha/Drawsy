import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';

import { AppComponent } from '@app/app/components/app/app.component';
import { HomeComponent } from '@app/app/components/home/home.component';
import { AlphaSliderComponent } from '@app/color-picker/components/alpha-slider/alpha-slider.component';
import { ColorFieldComponent } from '@app/color-picker/components/color-field/color-field.component';
import { ColorHexSelectorComponent } from '@app/color-picker/components/color-hex-selector/color-hex-selector.component';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { HueSliderComponent } from '@app/color-picker/components/hue-slider/hue-slider.component';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { SidebarColorPickerComponent } from '@app/editor/components/sidebar-color-picker/sidebar-color-picker.component';
import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
import { SidebarComponent } from '@app/editor/components/sidebar/sidebar.component';

// Disable max line length lint error due to detailed nesting
// tslint:disable: max-line-length
import { GuideExportDrawingComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-export-drawing/guide-export-drawing.component';
import { GuideGalleryComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-gallery/guide-gallery.component';
import { GuideSaveDrawingComponent } from '@app/guide/components/guide-content/guide-drawing-management/guide-save-drawing/guide-save-drawing.component';
import { GuideGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideUndoRedoComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-undo-redo/guide-undo-redo.component';
import { GuidePaintbrushComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSprayCanComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spray-can/guide-spray-can.component';
import { GuideClipboardComponent } from '@app/guide/components/guide-content/guide-tools/guide-clipboard/guide-clipboard.component';
import { GuideColorPickerComponent } from '@app/guide/components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '@app/guide/components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '@app/guide/components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '@app/guide/components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '@app/guide/components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '@app/guide/components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectionComponent } from '@app/guide/components/guide-content/guide-tools/guide-selection/guide-selection.component';
import { GuideEllipseComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideWelcomeComponent } from '@app/guide/components/guide-content/guide-welcome/guide-welcome.component';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
// tslint:enable: max-line-length

import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
import { DrawingSettingsComponent } from '@app/modals/components/settings/drawing-settings/drawing-settings.component';
import { GridSettingsComponent } from '@app/modals/components/settings/grid-settings/grid-settings.component';
import { SettingsComponent } from '@app/modals/components/settings/settings/settings.component';
import { ThemeSettingsComponent } from '@app/modals/components/settings/theme-settings/theme-settings.component';
import { DrawingsWithLabelsPipe } from '@app/modals/pipes/drawings-with-labels.pipe';
import { GalleryPreviewPipe } from '@app/modals/pipes/gallery-preview.pipe';
import { IsEmptyPipe } from '@app/modals/pipes/is-empty.pipe';
import { SortDrawingsPipe } from '@app/modals/pipes/sort-drawings.pipe';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { SudoModeService } from '@app/shared/services/sudo-mode.service';

@NgModule({
    declarations: [
        AlphaSliderComponent,
        AppComponent,
        ColorFieldComponent,
        ColorHexSelectorComponent,
        ColorPickerComponent,
        DrawingComponent,
        DrawingPreviewComponent,
        DrawingSettingsComponent,
        DrawingsWithLabelsPipe,
        EditorComponent,
        ExportDrawingComponent,
        GalleryComponent,
        GalleryPreviewPipe,
        GridSettingsComponent,
        GuideClipboardComponent,
        GuideColorComponent,
        GuideColorPickerComponent,
        GuideComponent,
        GuideEllipseComponent,
        GuideEraserComponent,
        GuideExportDrawingComponent,
        GuideFillComponent,
        GuideGalleryComponent,
        GuideGridComponent,
        GuideLineComponent,
        GuidePaintbrushComponent,
        GuidePencilComponent,
        GuidePolygonComponent,
        GuideRecolorComponent,
        GuideRectangleComponent,
        GuideSaveDrawingComponent,
        GuideSelectionComponent,
        GuideSidebarComponent,
        GuideSprayCanComponent,
        GuideUndoRedoComponent,
        GuideWelcomeComponent,
        HomeComponent,
        HueSliderComponent,
        IsEmptyPipe,
        NewDrawingComponent,
        SaveDrawingComponent,
        SettingsComponent,
        SidebarColorPickerComponent,
        SidebarComponent,
        SidebarDrawerComponent,
        SortDrawingsPipe,
        ThemeSettingsComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        ReactiveFormsModule,
    ],
    providers: [
        // Workaround to initialize SudoModeService early enough to be used from startup
        SudoModeService,
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => {}, // tslint:disable-line: no-empty
            deps: [SudoModeService, ShortcutService, SnackbarService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
