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

import { AppComponent } from './components/app/app.component';
import { ColorContainerComponent } from './components/color-picker/color-container/color-container.component';
import { ColorFieldComponent } from './components/color-picker/color-field/color-field.component';
import { ColorHexSelectorComponent } from './components/color-picker/color-hex-selector/color-hex-selector.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { CreateDrawingComponent } from './components/create-drawing/create-drawing.component';
import { DrawingComponent } from './components/editor/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { PanelSettingsComponent } from './components/editor/panel-settings/panel-settings.component';
import { SidebarComponent } from './components/editor/sidebar/sidebar.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { GuideGridComponent } from './components/guide/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from './components/guide/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from './components/guide/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from './components/guide/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideBrushComponent } from './components/guide/guide-content/guide-tools/guide-brushes/guide-brush/guide-brush.component';
import { GuideCalligraphyComponent } from './components/guide/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePencilComponent } from './components/guide/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from './components/guide/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from './components/guide/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from './components/guide/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from './components/guide/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from './components/guide/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from './components/guide/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from './components/guide/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from './components/guide/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from './components/guide/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from './components/guide/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from './components/guide/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from './components/guide/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from './components/guide/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from './components/guide/guide-content/guide-welcome/guide-welcome.component';
import { GuideDirective } from './components/guide/guide-directive/guide.directive';
import { GuideSidebarComponent } from './components/guide/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from './components/guide/guide.component';
import { DrawingSettingsComponent } from './components/editor/drawing-settings/drawing-settings.component';

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
        GuideBrushComponent,
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
        GuideBrushComponent,
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
