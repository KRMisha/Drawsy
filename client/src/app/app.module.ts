import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { GuideBrushComponent } from './components/guide/guide-brush/guide-brush.component';
import { GuideColorComponent } from './components/guide/guide-color/guide-color.component';
import { GuideDirective } from './components/guide/guide-directive/guide.directive';
import { GuideLineComponent } from './components/guide/guide-line/guide-line.component';
import { GuidePencilComponent } from './components/guide/guide-pencil/guide-pencil.component';
import { GuideRectangleComponent } from './components/guide/guide-rectangle/guide-rectangle.component';
import { GuideSidebarComponent } from './components/guide/guide-sidebar/guide-sidebar.component';
import { GuideWelcomeComponent } from './components/guide/guide-welcome/guide-welcome.component';
import { GuideComponent } from './components/guide/guide.component';
import { PanelColorComponent } from './components/panel-color/panel-color.component';
import { PanelSettingsComponent } from './components/panel-settings/panel-settings.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawingComponent,
        PanelColorComponent,
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
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        AppRoutingModule,
        MatExpansionModule,
    ],
    entryComponents: [
        GuideWelcomeComponent,
        GuideBrushComponent,
        GuidePencilComponent,
        GuideLineComponent,
        GuideRectangleComponent,
        GuideColorComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
