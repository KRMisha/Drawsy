import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { ColorContainerComponent } from './components/color-picker/color-container/color-container.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ColorFieldComponent } from './components/color-picker/color-field/color-field.component';
import { PanelSettingsComponent } from './components/editor/panel-settings/panel-settings.component';
import { SidebarComponent } from './components/editor/sidebar/sidebar.component';
import { CreateDrawingComponent } from './components/entry-point/create-drawing/create-drawing.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { GuideBrushComponent } from './components/guide/guide-brush/guide-brush.component';
import { GuideColorComponent } from './components/guide/guide-color/guide-color.component';
import { GuideDirective } from './components/guide/guide-directive/guide.directive';
import { GuideExportDrawingComponent } from './components/guide/guide-export-drawing/guide-export-drawing.component';
import { GuideLineComponent } from './components/guide/guide-line/guide-line.component';
import { GuidePencilComponent } from './components/guide/guide-pencil/guide-pencil.component';
import { GuideRectangleComponent } from './components/guide/guide-rectangle/guide-rectangle.component';
import { GuideSaveDrawingComponent } from './components/guide/guide-save-drawing/guide-save-drawing.component';
import { GuideSidebarComponent } from './components/guide/guide-sidebar/guide-sidebar.component';
import { GuideWelcomeComponent } from './components/guide/guide-welcome/guide-welcome.component';
import { GuideComponent } from './components/guide/guide.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawingComponent,
        PanelSettingsComponent,
        EntryPointComponent,
        EditorComponent,
        SidebarComponent,
        GuideComponent,
        GuideSidebarComponent,
        GuideWelcomeComponent,
        GuideBrushComponent,
        GuideDirective,
        GuidePencilComponent,
        GuideLineComponent,
        GuideColorComponent,
        GuideRectangleComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
        CreateDrawingComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        ColorContainerComponent,
        ColorFieldComponent,
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
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        AppRoutingModule,
        MatExpansionModule,
        MatDialogModule,
    ],
    entryComponents: [
        CreateDrawingComponent,
        GuideComponent,
        GuideWelcomeComponent,
        GuideBrushComponent,
        GuidePencilComponent,
        GuideLineComponent,
        GuideRectangleComponent,
        GuideColorComponent,
        GuideExportDrawingComponent,
        GuideSaveDrawingComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
