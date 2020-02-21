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
import { ColorContainerComponent } from './color-picker/color-container/color-container.component';
import { ColorFieldComponent } from './color-picker/color-field/color-field.component';
import { ColorHexSelectorComponent } from './color-picker/color-hex-selector/color-hex-selector.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider.component';
import { CreateDrawingComponent } from './modals/create-drawing/create-drawing.component';
import { DrawingSettingsComponent } from './editor/drawing-settings/drawing-settings.component';
import { DrawingComponent } from './drawing/drawing.component';
import { EditorComponent } from './editor/editor.component';
import { PanelSettingsComponent } from './editor/panel-settings/panel-settings.component';
import { SidebarComponent } from './editor/sidebar/sidebar.component';
import { EntryPointComponent } from './home/entry-point.component';
import { GuideGridComponent } from './guide/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from './guide/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from './guide/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from './guide/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from './guide/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from './guide/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from './guide/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from './guide/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from './guide/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from './guide/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from './guide/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from './guide/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from './guide/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from './guide/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from './guide/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from './guide/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from './guide/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from './guide/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from './guide/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from './guide/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from './guide/guide-content/guide-welcome/guide-welcome.component';
import { GuideDirective } from './guide/guide-directive/guide.directive';
import { GuideSidebarComponent } from './guide/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from './guide/guide.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawingComponent,
        PanelSettingsComponent,
        EntryPointComponent,
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
        CreateDrawingComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        ColorContainerComponent,
        ColorFieldComponent,
        ColorHexSelectorComponent,
        DrawingSettingsComponent,
        GuideCalligraphyComponent,
        GuidePaintbrushComponent,
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
        CreateDrawingComponent,
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
        DrawingSettingsComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
