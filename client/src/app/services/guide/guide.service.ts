import { Injectable, Type } from '@angular/core';

import { GuideBrushComponent } from '../../components/guide/guide-brush/guide-brush.component';
import { GuideColorComponent } from '../../components/guide/guide-color/guide-color.component';
import { GuideLineComponent } from '../../components/guide/guide-line/guide-line.component';
import { GuidePencilComponent } from '../../components/guide/guide-pencil/guide-pencil.component';
import { GuideRectangleComponent } from '../../components/guide/guide-rectangle/guide-rectangle.component';
import { GuideWelcomeComponent } from '../../components/guide/guide-welcome/guide-welcome.component';

const guides: Type<any>[] = [GuideWelcomeComponent, GuidePencilComponent, GuideBrushComponent,
                             GuideLineComponent, GuideRectangleComponent, GuideColorComponent];

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    getGuides(): Type<any>[] {
        return guides;
    }
}
