import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideContent } from '@app/guide/classes/guide-content';
import { GuideNode } from '@app/guide/classes/guide-node';
import { GuideSidebarComponent } from '@app/guide/components/guide-sidebar/guide-sidebar.component';
import { GuideService } from '@app/guide/services/guide.service';

class FirstGuideNodeMock implements GuideContent {}
class SecondGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file
class ThirdGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file
class FourthGuideNodeMock implements GuideContent {} // tslint:disable-line: max-classes-per-file

const firstGuideNodeMock: GuideNode = { name: 'FirstGuideNodeMock', guide: FirstGuideNodeMock, previousGuideNode: undefined };
const secondGuideNodeMock: GuideNode = { name: 'SecondGuideNodeMock', guide: SecondGuideNodeMock, previousGuideNode: FirstGuideNodeMock };
const thirdGuideNodeMock: GuideNode = { name: 'ThirdGuideNodeMock', guide: ThirdGuideNodeMock, previousGuideNode: SecondGuideNodeMock };
const fourthGuideNodeMock: GuideNode = { name: 'FourthGuideNodeMock', guide: FourthGuideNodeMock, previousGuideNode: ThirdGuideNodeMock };

firstGuideNodeMock.nextGuideNode = secondGuideNodeMock;
firstGuideNodeMock.children = [secondGuideNodeMock, thirdGuideNodeMock];

secondGuideNodeMock.nextGuideNode = thirdGuideNodeMock;
thirdGuideNodeMock.nextGuideNode = undefined;

fourthGuideNodeMock.children = [firstGuideNodeMock];

const guidesMock = [firstGuideNodeMock, secondGuideNodeMock, thirdGuideNodeMock];

describe('GuideSidebarComponent', () => {
    let guideSidebarComponent: GuideSidebarComponent;
    let fixture: ComponentFixture<GuideSidebarComponent>;
    let guideServiceSpyObj: jasmine.SpyObj<GuideService>;

    beforeEach(async(() => {
        guideServiceSpyObj = jasmine.createSpyObj('GuideService', [], { currentGuideNode: secondGuideNodeMock });
        TestBed.configureTestingModule({
            declarations: [GuideSidebarComponent],
            providers: [{ provide: GuideService, useValue: guideServiceSpyObj }],
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

    it('#NestedTreeControl should be set to se the children of the passed guideNode', () => {
        const returnedChildren = guideSidebarComponent.treeControl.getChildren(fourthGuideNodeMock);
        expect(returnedChildren).toEqual(fourthGuideNodeMock.children);
    });

    it('#expandAllMenus should recursively call #expandLayer', () => {
        const exapandLayerSpy = spyOn<any>(guideSidebarComponent, 'expandLayer').and.callThrough(); // tslint:disable-line: no-any
        guideSidebarComponent.expandAllMenus();
        expect(exapandLayerSpy).toHaveBeenCalledTimes(2);
    });

    it("#currentGuideNodeGetter should  return the guideSerivce's currentGuideNode attribute", () => {
        guideSidebarComponent.currentGuideNode = thirdGuideNodeMock;
        const returnedCurrentGuideNode = guideSidebarComponent.currentGuideNode;
        expect(guideServiceSpyObj.currentGuideNode).toEqual(returnedCurrentGuideNode);
    });

    it("#currentGuideNodeSetter should set the guideService's currentGuideNode attribute", () => {
        guideSidebarComponent.currentGuideNode = secondGuideNodeMock;
        expect(guideServiceSpyObj.currentGuideNode).toEqual(secondGuideNodeMock);
    });

    it('#hasChild callback should return true if the node has a child', () => {
        const hasChildResult = guideSidebarComponent.hasChild(0, fourthGuideNodeMock);
        expect(hasChildResult).toBe(true);
    });

    it('#hasChild callback should return true if the node has chlidren', () => {
        const hasChildResult = guideSidebarComponent.hasChild(0, firstGuideNodeMock);
        expect(hasChildResult).toBe(true);
    });

    it('#hasChild callback should return false if the node has no child', () => {
        const hasChildResult = guideSidebarComponent.hasChild(0, thirdGuideNodeMock);
        expect(hasChildResult).toBe(false);
    });
});
