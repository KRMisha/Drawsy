import { TestBed } from '@angular/core/testing';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideService } from '@app/guide/services/guide.service';

class GuideNodeMock implements GuideContent {}

describe('GuideService', () => {
    let guideService: GuideService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: GuideService},
            ]
        });
        guideService = TestBed.inject(GuideService);
    });

    it('should be created', () => {
        expect(guideService).toBeTruthy();
    });

    it('#getter should return current GuideNode', () => {
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: GuideNodeMock, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(guideService.currentGuideNode).toBe(guideNodeMock);
    });

    it('#setter should emit changedGuide observable if the guide of the guideNode is not undefined', () => {
        // tslint:disable: no-string-literal
        spyOn(guideService['currentGuideChangedSource'], 'next');
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: GuideNodeMock, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(guideService['currentGuideChangedSource'].next).toHaveBeenCalled();
        // tslint:enable: no-string-literal
    });

    it('#setter should not emit changedGuide observable if the guide of the guideNode is undefined', () => {
        // tslint:disable: no-string-literal
        spyOn(guideService['currentGuideChangedSource'], 'next');
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: undefined, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(guideService['currentGuideChangedSource'].next).not.toHaveBeenCalled();
        // tslint:enable: no-string-literal
    });
});
