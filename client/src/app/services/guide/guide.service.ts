import { Injectable, Type } from '@angular/core';

import { GuideBrushComponent } from '../../components/guide/guide-brush/guide-brush.component';
import { GuidePencilComponent } from '../../components/guide/guide-pencil/guide-pencil.component';
import { GuideWelcomeComponent } from '../../components/guide/guide-welcome/guide-welcome.component';

const guides: Type<any>[] = [GuideWelcomeComponent, GuidePencilComponent, GuideBrushComponent];

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    getGuides(): Type<any>[] {
        return guides;
    }
}
