// import { TestBed } from '@angular/core/testing';
// import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
// import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

// // tslint:disable: no-any

// describe('ToolSelectionStateService', () => {
//     let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
//     let service: ToolSelectionStateService;

//     const elementListBounds = { x: 69, y: 420, width: 666, height: 69420 };

//     beforeEach(() => {
//         toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);
//         toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(elementListBounds);

//         TestBed.configureTestingModule({
//             providers: [{ provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj }],
//         });

//         service = TestBed.inject(ToolSelectionStateService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('#updateSelectionRect should give the selection rect the bounds of the selected elements', () => {
//         service.updateSelectedElementsRect();
//         expect(service.selectedElementsRect).toEqual(elementListBounds);
//     });

//     it('#selectedElements should update the selection rect', () => {
//         const updateSelectionRectSpy = spyOn<any>(service, 'updateSelectionRect');
//         service.selectedElements = [];
//         expect(updateSelectionRectSpy).toHaveBeenCalled();
//     });

//     it("#selectedElements should notify it's subcribers that it's value has changed", () => {
//         // tslint:disable-next-line: no-string-literal
//         const selectedElementsChangedSourceSpy = spyOn<any>(service['selectedElementsChangedSource'], 'next');
//         service.selectedElements = [];
//         expect(selectedElementsChangedSourceSpy).toHaveBeenCalled();
//     });
// });
