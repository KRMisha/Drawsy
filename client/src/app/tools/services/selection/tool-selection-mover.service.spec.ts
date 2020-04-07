// import { TestBed } from '@angular/core/testing';
// import { DrawingService } from '@app/drawing/services/drawing.service';
// import { HistoryService } from '@app/drawing/services/history.service';
// import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
// import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
// import { ToolSelectionUiService } from '@app/tools/services/selection/tool-selection-ui.service';

// // tslint:disable: no-empty
// // tslint:disable: no-string-literal
// // tslint:disable: no-any

// describe('ToolSelectionMoverService', () => {
//     const moveOffset = 3;
//     let service: ToolSelectionMoverService;
//     let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
//     let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
//     let toolSelectionUiServiceSpyObj: jasmine.SpyObj<ToolSelectionUiService>;
//     let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

//     let moveElementListSpy: any;
//     let setArrowStateFromEventSpy: any;

//     beforeEach(() => {
//         drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['appendNewMatrixToElements'], {
//             svgElements: [],
//         });

//         toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['updateSelectionRect'], {
//             isMovingSelectionWithMouse: false,
//             isMovingSelectionWithArrows: false,
//             selectedElements: [],
//             selectionRect: { x: 0, y: 0 },
//         });

//         toolSelectionUiServiceSpyObj = jasmine.createSpyObj('ToolSelectionUiService', ['updateSvgSelectedShapesRect']);

//         historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: DrawingService, useValue: drawingServiceSpyObj },
//                 { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
//                 { provide: ToolSelectionUiService, useValue: toolSelectionUiServiceSpyObj },
//                 { provide: HistoryService, useValue: historyServiceSpyObj },
//             ],
//         });

//         service = TestBed.inject(ToolSelectionMoverService);

//         service['isArrowUpHeld'] = false;
//         service['isArrowDownHeld'] = false;
//         service['isArrowLeftHeld'] = false;
//         service['isArrowRightHeld'] = false;

//         moveElementListSpy = spyOn<any>(service, 'moveElementList').and.callThrough();
//         setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent').and.callThrough();
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('#moveSelection should move the selection', () => {
//         service.moveSelection({ x: 0, y: 0 }, { x: 1, y: 2 });
//         expect(moveElementListSpy).toHaveBeenCalled();
//         expect(toolSelectionUiServiceSpyObj.setSelectedElementsRectFromElements).toHaveBeenCalled();
//         expect(toolSelectionStateServiceSpyObj.updateSelectedElementsRect).toHaveBeenCalled();
//     });

//     it('#onKeyDown should set arrow state', () => {
//         service.onKeyDown({} as KeyboardEvent);
//         expect(setArrowStateFromEventSpy).toHaveBeenCalled();
//     });

//     it('#onKeyDown should not appendNewMatrixToElements is user is moving selection with mouse', () => {
//         service['toolSelectionStateService'] = ({ isMovingSelectionWithMouse: true } as unknown) as ToolSelectionStateService;
//         service.onKeyDown({} as KeyboardEvent);
//         expect(drawingServiceSpyObj.appendNewMatrixToElements).not.toHaveBeenCalled();
//     });

//     it('#onKeyDown should not appendNewMatrixToElements if user is moving selection with arrows', () => {
//         service['toolSelectionStateService'] = ({ isMovingSelectionWithArrows: true } as unknown) as ToolSelectionStateService;
//         service.onKeyDown({} as KeyboardEvent);
//         expect(drawingServiceSpyObj.appendNewMatrixToElements).not.toHaveBeenCalled();
//     });

//     it('#onKeyDown should appendNewMatrixToElements and move selection if user is not currently moving the selection', () => {
//         service['isArrowLeftHeld'] = true;
//         const moveSelectionInArrowDirectionSpy = spyOn<any>(service, 'moveSelectionInArrowDirection');
//         service.onKeyDown({} as KeyboardEvent);
//         expect(drawingServiceSpyObj.appendNewMatrixToElements).toHaveBeenCalled();
//         expect(moveSelectionInArrowDirectionSpy).toHaveBeenCalled();
//     });

//     it('#onKeyDown should call moveSelectionInArrowDirection after 500ms', () => {
//         jasmine.clock().install();
//         service['isArrowLeftHeld'] = true;
//         const moveSelectionInArrowDirectionSpy = spyOn<any>(service, 'moveSelectionInArrowDirection');
//         service.onKeyDown({} as KeyboardEvent);

//         const intervalMs = 100;
//         jasmine.clock().tick(intervalMs);

//         let callCount = 1;
//         expect(moveSelectionInArrowDirectionSpy).toHaveBeenCalledTimes(callCount++);

//         const timeoutMs = 500;
//         jasmine.clock().tick(timeoutMs);

//         expect(moveSelectionInArrowDirectionSpy).toHaveBeenCalledTimes(callCount++);
//         jasmine.clock().uninstall();
//     });

//     it('#onKeyUp should set arrow state', () => {
//         service['isArrowDownHeld'] = true;
//         service.onKeyUp({} as KeyboardEvent);
//         expect(setArrowStateFromEventSpy).toHaveBeenCalled();
//     });

//     it('#onKeyUp should add a command if object has moved and no other arrow is held by user', () => {
//         service['totalSelectionMoveOffset'] = { x: 0, y: 420 };
//         const addComandSpy = spyOn<any>(service, 'addMoveCommand');
//         service.onKeyUp({} as KeyboardEvent);
//         expect(addComandSpy).toHaveBeenCalled();
//     });

//     it('#onKeyUp should not add a command if object has not moved and no other arrow is held by user', () => {
//         service['totalSelectionMoveOffset'] = { x: 0, y: 0 };
//         const addComandSpy = spyOn<any>(service, 'addMoveCommand');
//         service.onKeyUp({} as KeyboardEvent);
//         expect(addComandSpy).not.toHaveBeenCalled();
//     });

//     it('#onKeyUp clear timeout when user has finished moving selection with arrows', () => {
//         service['movingTimeout'] = 1;
//         const windowClearIntervalSpy = spyOn<any>(window, 'clearTimeout');
//         service.onKeyUp({} as KeyboardEvent);
//         expect(windowClearIntervalSpy).toHaveBeenCalled();
//     });

//     it('#addMoveCommand should add command', () => {
//         service.addMoveCommand();
//         expect(historyServiceSpyObj.addCommand).toHaveBeenCalled();
//     });

//     it('#setArrowStateFromEvent should set the correct state depeding on the event', () => {
//         service['setArrowStateFromEvent']({ key: 'ArrowUp' } as KeyboardEvent, true);
//         expect(service['isArrowUpHeld']).toEqual(true);

//         service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, true);
//         expect(service['isArrowDownHeld']).toEqual(true);

//         service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, true);
//         expect(service['isArrowLeftHeld']).toEqual(true);

//         service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, true);
//         expect(service['isArrowRightHeld']).toEqual(true);

//         service['setArrowStateFromEvent']({ key: 'ArrowUp' } as KeyboardEvent, false);
//         expect(service['isArrowUpHeld']).toEqual(false);

//         service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, false);
//         expect(service['isArrowDownHeld']).toEqual(false);

//         service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, false);
//         expect(service['isArrowLeftHeld']).toEqual(false);

//         service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, false);
//         expect(service['isArrowRightHeld']).toEqual(false);
//     });

//     it('#moveElementList should tranlate matrix of elements sent', () => {
//         const matrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['translate']);
//         const svgTransformListSpyObj = jasmine.createSpyObj('SVGTransformList', ['setMatrix'], {
//             matrix: matrixSpyObj,
//         });
//         const baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem']);
//         baseValSpyObj.getItem.and.returnValue(svgTransformListSpyObj);
//         const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], {
//             transform: { baseVal: baseValSpyObj },
//         });
//         service['moveElementList']([elementSpyObj], { x: 69, y: 420 });
//         expect(matrixSpyObj.translate).toHaveBeenCalled();
//     });

//     it('#moveSelectionInArrowDirection should not move horizontaly if right and left key are held', () => {
//         service['isArrowLeftHeld'] = true;
//         service['isArrowRightHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].x).toEqual(0);
//     });

//     it('#moveSelectionInArrowDirection should not move vertically if up and down key are held', () => {
//         service['isArrowUpHeld'] = true;
//         service['isArrowDownHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].y).toEqual(0);
//     });

//     it('#moveSelectionInArrowDirection should move horizontaly if left key is held', () => {
//         service['isArrowLeftHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].x).toEqual(-moveOffset);
//     });

//     it('#moveSelectionInArrowDirection should move vertically if up key is held', () => {
//         service['isArrowUpHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].y).toEqual(-moveOffset);
//     });

//     it('#moveSelectionInArrowDirection should move horizontaly if right key is held', () => {
//         service['isArrowRightHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].x).toEqual(moveOffset);
//     });

//     it('#moveSelectionInArrowDirection should move vertically if up down is held', () => {
//         service['isArrowDownHeld'] = true;
//         service['moveSelectionInArrowDirection']();
//         expect(service['totalSelectionMoveOffset'].y).toEqual(moveOffset);
//     });
// });
