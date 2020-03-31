import { Injectable, Type } from '@angular/core';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { guideData } from '@app/guide/constants/guide-data';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GuideService {
    private _currentGuideNode: GuideNode = guideData[0]; // tslint:disable-line: variable-name

    // The first GuideNode always has a valid guide because it is the welcome guide
    // tslint:disable-next-line: no-non-null-assertion
    private currentGuideChangedSource = new BehaviorSubject<Type<GuideContent>>(this._currentGuideNode.guide!);

    // Disable member ordering lint error for public observables initialized after private subjects
    currentGuideChanged$ = this.currentGuideChangedSource.asObservable(); // tslint:disable-line: member-ordering

    selectPreviousGuide(): void {
        if (this.currentGuideNode.previousGuideNode !== undefined) {
            this.currentGuideNode = this.currentGuideNode.previousGuideNode;
        }
    }

    selectNextGuide(): void {
        if (this.currentGuideNode.nextGuideNode !== undefined) {
            this.currentGuideNode = this.currentGuideNode.nextGuideNode;
        }
    }

    get currentGuideNode(): GuideNode {
        return this._currentGuideNode;
    }

    set currentGuideNode(guideNode: GuideNode) {
        this._currentGuideNode = guideNode;
        if (this._currentGuideNode.guide !== undefined) {
            this.currentGuideChangedSource.next(this._currentGuideNode.guide);
        }
    }
}
