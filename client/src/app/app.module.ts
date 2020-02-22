// Disable max line length for long imports due to detailed nesting
// tslint:disable: max-line-length

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app/app.component';
import { ColorContainerComponent } from './color-picker/components/color-container/color-container.component';
import { ColorFieldComponent } from './color-picker/components/color-field/color-field.component';
import { ColorHexSelectorComponent } from './color-picker/components/color-hex-selector/color-hex-selector.component';
import { ColorPickerComponent } from './color-picker/components/color-picker/color-picker.component';
import { ColorSliderComponent } from './color-picker/components/color-slider/color-slider.component';
import { DrawingSettingsComponent } from './editor/components/drawing-settings/drawing-settings.component';
import { DrawingComponent } from './drawing/components/drawing/drawing.component';
import { EditorComponent } from './editor/components/editor/editor.component';
import { SidebarComponent } from './editor/components/sidebar/sidebar.component';
import { GuideGridComponent } from './guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from './guide/components/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from './guide/components/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from './guide/components/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from './guide/components/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from './guide/components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from './guide/components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from './guide/components/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from './guide/components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from './guide/components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from './guide/components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from './guide/components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from './guide/components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from './guide/components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from './guide/components/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from './guide/components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from './guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from './guide/components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from './guide/components/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from './guide/components/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from './guide/components/guide-content/guide-welcome/guide-welcome.component';
import { GuideDirective } from './guide/components/guide-directive/guide.directive';
import { GuideSidebarComponent } from './guide/components/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from './guide/components/guide/guide.component';
import { SidebarDrawerComponent } from './editor/components/sidebar-drawer/sidebar-drawer.component';
import { HomeComponent } from './home/components/home/home.component';
import { NewDrawingComponent } from './modals/components/new-drawing/new-drawing.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawingComponent,
        EditorComponent,
        SidebarComponent,
        GuideComponent,
        GuideWelcomeComponent,
        GuideSpraypaintComponent,
        GuidePencilComponent,
        GuideCalligraphyComponent,
        GuideEllipseComponent,
        GuidePolygonComponent,
        GuideRectangleComponent,
        GuideRecolorComponent,
        GuideColorComponent,
        GuideEraserComponent,
        GuideStampComponent,
        GuideLineComponent,
        GuideColorPickerComponent,
        GuideFillComponent,
        GuideTextComponent,
        GuideSelectComponent,
        GuideGridComponent,
        GuideSnapToGridComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
        GuideSidebarComponent,
        GuideDirective,
        ColorPickerComponent,
        ColorSliderComponent,
        ColorContainerComponent,
        ColorFieldComponent,
        ColorHexSelectorComponent,
        DrawingSettingsComponent,
        GuideCalligraphyComponent,
        GuidePaintbrushComponent,
        SidebarDrawerComponent,
        HomeComponent,
        NewDrawingComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatCheckboxModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        AppRoutingModule,
        MatExpansionModule,
        MatDialogModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    entryComponents: [
        DrawingSettingsComponent,
        GuideComponent,
        GuideWelcomeComponent,
        GuideSpraypaintComponent,
        GuidePencilComponent,
        GuidePaintbrushComponent,
        GuideCalligraphyComponent,
        GuideEllipseComponent,
        GuidePolygonComponent,
        GuideRectangleComponent,
        GuideRecolorComponent,
        GuideColorComponent,
        GuideEraserComponent,
        GuideStampComponent,
        GuideLineComponent,
        GuideColorPickerComponent,
        GuideFillComponent,
        GuideTextComponent,
        GuideSelectComponent,
        GuideGridComponent,
        GuideSnapToGridComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
        NewDrawingComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
