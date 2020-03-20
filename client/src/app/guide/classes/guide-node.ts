import { Type } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';

export interface GuideNode {
    name: string;
    children?: GuideNode[];
    guide?: Type<GuideContent>;

    previousGuideNode?: GuideNode;
    nextGuideNode?: GuideNode;
}
