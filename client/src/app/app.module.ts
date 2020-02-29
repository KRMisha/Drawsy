// Disable max line length for long imports due to detailed nesting
// tslint:disable: max-line-length

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { AppComponent } from '@app/app/app.component';
import { AlphaSliderComponent } from '@app/color-picker/components/alpha-slider/alpha-slider.component';
import { ColorFieldComponent } from '@app/color-picker/components/color-field/color-field.component';
import { ColorHexSelectorComponent } from '@app/color-picker/components/color-hex-selector/color-hex-selector.component';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { HueSliderComponent } from '@app/color-picker/components/hue-slider/hue-slider.component';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingSettingsComponent } from '@app/editor/components/drawing-settings/drawing-settings.component';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { SidebarColorPickerComponent } from '@app/editor/components/sidebar-color-picker/sidebar-color-picker.component';
import { SidebarDrawerComponent } from '@app/editor/components/sidebar-drawer/sidebar-drawer.component';
import { SidebarComponent } from '@app/editor/components/sidebar/sidebar.component';
import { GuideGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-grid/guide-grid.component';
import { GuideSnapToGridComponent } from '@app/guide/components/guide-content/guide-drawing-surface/guide-snap-to-grid/guide-snap-to-grid.component';
import { GuideExportDrawingComponent } from '@app/guide/components/guide-content/guide-file-options/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from '@app/guide/components/guide-content/guide-file-options/guide-save-drawing/guide-save-drawing.component';
import { GuideCalligraphyComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-calligraphy/guide-calligraphy.component';
import { GuidePaintbrushComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-paintbrush/guide-paintbrush.component';
import { GuidePencilComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-pencil/guide-pencil.component';
import { GuideSpraypaintComponent } from '@app/guide/components/guide-content/guide-tools/guide-brushes/guide-spraypaint/guide-spraypaint.component';
import { GuideColorPickerComponent } from '@app/guide/components/guide-content/guide-tools/guide-color-picker/guide-color-picker.component';
import { GuideColorComponent } from '@app/guide/components/guide-content/guide-tools/guide-color/guide-color.component';
import { GuideEraserComponent } from '@app/guide/components/guide-content/guide-tools/guide-eraser/guide-eraser.component';
import { GuideFillComponent } from '@app/guide/components/guide-content/guide-tools/guide-fill/guide-fill.component';
import { GuideLineComponent } from '@app/guide/components/guide-content/guide-tools/guide-line/guide-line.component';
import { GuideRecolorComponent } from '@app/guide/components/guide-content/guide-tools/guide-recolor/guide-recolor.component';
import { GuideSelectComponent } from '@app/guide/components/guide-content/guide-tools/guide-select/guide-select.component';
import { GuideEllipseComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-ellipse/guide-ellipse.component';
import { GuidePolygonComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-polygon/guide-polygon.component';
import { GuideRectangleComponent } from '@app/guide/components/guide-content/guide-tools/guide-shapes/guide-rectangle/guide-rectangle.component';
import { GuideStampComponent } from '@app/guide/components/guide-content/guide-tools/guide-stamp/guide-stamp.component';
import { GuideTextComponent } from '@app/guide/components/guide-content/guide-tools/guide-text/guide-text.component';
import { GuideWelcomeComponent } from '@app/guide/components/guide-content/guide-welcome/guide-welcome.component';
import { GuideDirective } from '@app/guide/components/guide-directive/guide.directive';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideComponent } from '@app/guide/components/guide/guide.component';
import { HomeComponent } from '@app/home/components/home/home.component';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';

@NgModule({
    declarations: [
        AlphaSliderComponent,
        AppComponent,
        ColorFieldComponent,
        ColorHexSelectorComponent,
        ColorPickerComponent,
        DrawingComponent,
        DrawingSettingsComponent,
        EditorComponent,
        GuideCalligraphyComponent,
        GuideCalligraphyComponent,
        GuideColorComponent,
        GuideColorPickerComponent,
        GuideComponent,
        GuideDirective,
        GuideEllipseComponent,
        GuideEraserComponent,
        GuideExportDrawingComponent,
        GuideFillComponent,
        GuideGridComponent,
        GuideLineComponent,
        GuidePaintbrushComponent,
        GuidePencilComponent,
        GuidePolygonComponent,
        GuideRecolorComponent,
        GuideRectangleComponent,
        GuideSaveDrawingComponent,
        GuideSelectComponent,
        GuideSidebarComponent,
        GuideSnapToGridComponent,
        GuideSpraypaintComponent,
        GuideStampComponent,
        GuideTextComponent,
        GuideWelcomeComponent,
        HomeComponent,
        HueSliderComponent,
        NewDrawingComponent,
        SidebarComponent,
        SidebarDrawerComponent,
        SidebarColorPickerComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTreeModule,
        ReactiveFormsModule,
    ],
    entryComponents: [
        DrawingSettingsComponent,
        GuideCalligraphyComponent,
        GuideColorComponent,
        GuideColorPickerComponent,
        GuideComponent,
        GuideEllipseComponent,
        GuideEraserComponent,
        GuideExportDrawingComponent,
        GuideFillComponent,
        GuideGridComponent,
        GuideLineComponent,
        GuidePaintbrushComponent,
        GuidePencilComponent,
        GuidePolygonComponent,
        GuideRecolorComponent,
        GuideRectangleComponent,
        GuideSaveDrawingComponent,
        GuideSelectComponent,
        GuideSnapToGridComponent,
        GuideSpraypaintComponent,
        GuideStampComponent,
        GuideTextComponent,
        GuideWelcomeComponent,
        NewDrawingComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
