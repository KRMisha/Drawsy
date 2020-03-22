import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideService } from '@app/guide/services/guide.service';

class FirstGuideNodeMock implements GuideContent {}
class SecondGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file
class ThirdGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file

const firstGuideNodeMock: GuideNode = { name: 'FirstGuideNodeMock', guide: FirstGuideNodeMock, previousGuideNode: undefined };
const secondGuideNodeMock: GuideNode = { name: 'SecondGuideNodeMock', guide: SecondGuideNodeMock, previousGuideNode: FirstGuideNodeMock };
const thirdGuideNodeMock: GuideNode = { name: 'ThirdGuideNodeMock', guide: ThirdGuideNodeMock, previousGuideNode: SecondGuideNodeMock };

firstGuideNodeMock.nextGuideNode = secondGuideNodeMock;
firstGuideNodeMock.children = [
    secondGuideNodeMock,
    thirdGuideNodeMock,
];

secondGuideNodeMock.nextGuideNode = thirdGuideNodeMock;
thirdGuideNodeMock.nextGuideNode = undefined;

const guidesMock = [
    firstGuideNodeMock,
    secondGuideNodeMock,
    thirdGuideNodeMock,
];

describe('GuideSidebarComponent', () => {
    let guideSidebarComponent: GuideSidebarComponent;
    let fixture: ComponentFixture<GuideSidebarComponent>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;

    beforeEach(async(() => {
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', [], [
            {currentGuideNode: secondGuideNodeMock},
        ]);
        TestBed.configureTestingModule({
            declarations: [GuideSidebarComponent],
            providers: [
                {provide: GuideService, useValue: guideServiceSpyObj},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideSidebarComponent);
        guideSidebarComponent = fixture.componentInstance;
        fixture.detectChanges();
        guideSidebarComponent.dataSource.data = guidesMock;
    });

    it('should create', () => {
        expect(guideSidebarComponent).toBeTruthy();
    });

    it('#expandAllMenus should recursively call #expandLayer', () => {
        spyOn<any>(guideSidebarComponent, 'expandLayer').and.callThrough(); // tslint:disable-line: no-any
        guideSidebarComponent.expandAllMenus();
        expect(guideSidebarComponent['expandLayer']).toHaveBeenCalledTimes(2); // tslint:disable-line: no-string-literal
    });

    it('#currentGuideNodeGetter should  return the guideSerivce\'s currentGuideNode attribute', () => {
        guideSidebarComponent.currentGuideNode = thirdGuideNodeMock;
        const returnedCurrentGuideNode = guideSidebarComponent.currentGuideNode;
        expect(guideServiceSpyObj.currentGuideNode).toEqual(returnedCurrentGuideNode);
    });

    it('#currentGuideNodeSetter should set the guideService\'s currentGuideNode attribute', () => {
        guideSidebarComponent.currentGuideNode = secondGuideNodeMock;
        expect(guideServiceSpyObj.currentGuideNode).toEqual(secondGuideNodeMock);
    });
});
