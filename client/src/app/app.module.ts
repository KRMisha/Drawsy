import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import {DrawingComponent} from './components/drawing/drawing.component';
import { PanelColorComponent } from './components/panel-color/panel-color.component';
import { PanelSettingsComponent } from './components/panel-settings/panel-settings.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@NgModule({
    declarations: [AppComponent, DrawingComponent, PanelColorComponent, PanelSettingsComponent, SideBarComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, BrowserAnimationsModule, MatSliderModule, MatButtonModule,
              MatIconModule, MatSidenavModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
