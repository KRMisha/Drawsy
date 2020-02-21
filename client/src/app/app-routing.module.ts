import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditorComponent } from './editor/editor.component';
import { EntryPointComponent } from './home/entry-point.component';

const routes: Routes = [
    { path: '', redirectTo: '/entry-point', pathMatch: 'full' },
    { path: 'entry-point', component: EntryPointComponent },
    { path: 'editor', component: EditorComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
