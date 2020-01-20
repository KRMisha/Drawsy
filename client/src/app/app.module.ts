import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingComponent } from './components/drawing/drawing.component';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { PanelColorComponent } from './components/panel-color/panel-color.component';
import { PanelSettingsComponent } from './components/panel-settings/panel-settings.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@NgModule({
    declarations: [AppComponent, DrawingComponent, PanelColorComponent, PanelSettingsComponent, SideBarComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, BrowserAnimationsModule, MatSliderModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
