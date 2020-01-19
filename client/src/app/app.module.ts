import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, BrowserAnimationsModule, MatSliderModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
