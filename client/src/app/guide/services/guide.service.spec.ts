import { async, TestBed } from '@angular/core/testing';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideService } from '@app/guide/services/guide.service';

// tslint:disable: max-classes-per-file

class GuideNodeMock implements GuideContent {}
class FirstGuideNodeMock implements GuideContent {}
class SecondGuideNodeMock implements GuideContent {}

const firstGuideNodeMock: GuideNode = {
    name: 'FirstGuideNodeMock',
    guide: FirstGuideNodeMock,
    previousGuideNode: undefined,
    nextGuideNode: undefined,
};

const secondGuideNodeMock: GuideNode = {
    name: 'SecondGuideNodeMock',
    guide: SecondGuideNodeMock,
    previousGuideNode: firstGuideNodeMock,
    nextGuideNode: undefined,
};
firstGuideNodeMock.nextGuideNode = secondGuideNodeMock;

describe('GuideService', () => {
    let guideService: GuideService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GuideService }],
        });
        guideService = TestBed.inject(GuideService);
    }));

    it('should be created', () => {
        expect(guideService).toBeTruthy();
    });

    it('#selectPreviousGuide should update the currentGuide if its previous guide is not undefined', () => {
        guideService.currentGuideNode = secondGuideNodeMock;
        guideService.selectPreviousGuide();
        expect(guideService.currentGuideNode).toEqual(firstGuideNodeMock);
    });

    it('#selectPreviousGuide should not update the currentGuide if its previous guide is undefined', () => {
        guideService.currentGuideNode = firstGuideNodeMock;
        guideService.selectPreviousGuide();
        expect(guideService.currentGuideNode).toEqual(firstGuideNodeMock);
    });

    it('#selectNextGuide should update the currentGuide if its next guide is not undefined', () => {
        guideService.currentGuideNode = firstGuideNodeMock;
        guideService.selectNextGuide();
        expect(guideService.currentGuideNode).toEqual(secondGuideNodeMock);
    });

    it('#selectNextGuide should not update the currentGuide if its next guide is undefined', () => {
        guideService.currentGuideNode = secondGuideNodeMock;
        guideService.selectNextGuide();
        expect(guideService.currentGuideNode).toEqual(secondGuideNodeMock);
    });

    it('#get currentGuideNode should return current GuideNode', () => {
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: GuideNodeMock, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(guideService.currentGuideNode).toEqual(guideNodeMock);
    });

    it('#set currentGuideNode should emit changedGuide observable if the guide of the guideNode is not undefined', async(() => {
        const subscriberSpyObj = jasmine.createSpyObj('Subscriber', ['subscribeLogic']);
        guideService.currentGuideChanged$.subscribe((guide: GuideNode) => {
            subscriberSpyObj.subscribeLogic(guide);
        });
        // Since currentGuideChanged$ is a BehaviorSubject, we need to discard the first guide received
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(guideService.currentGuideNode.guide);
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: GuideNodeMock, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(guideNodeMock.guide);
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledTimes(2);
    }));

    it('#set currentGuideNode should not emit changedGuide observable if the guide of the guideNode is undefined', async(() => {
        const subscriberSpyObj = jasmine.createSpyObj('Subscriber', ['subscribeLogic']);
        guideService.currentGuideChanged$.subscribe((guide: GuideNode) => {
            subscriberSpyObj.subscribeLogic(guide);
        });
        // Since currentGuideChanged$ is a BehaviorSubject, we need to discard the first guide received
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledWith(guideService.currentGuideNode.guide);
        const guideNodeMock: GuideNode = { name: 'GuideNodeMock', guide: undefined, previousGuideNode: GuideNodeMock };
        guideService.currentGuideNode = guideNodeMock;
        expect(subscriberSpyObj.subscribeLogic).toHaveBeenCalledTimes(1);
    }));
});
