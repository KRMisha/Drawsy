import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditorComponent } from './components/editor/editor.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { GuideComponent } from './components/guide/guide.component';

const routes: Routes = [
    { path: '', redirectTo: '/entry-point', pathMatch: 'full' },
    { path: 'entry-point', component: EntryPointComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'guide', component: GuideComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
