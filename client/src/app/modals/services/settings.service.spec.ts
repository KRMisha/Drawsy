import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ThemeService } from '@app/app/services/theme.service';
import DrawingDimensionsValidation from '@app/drawing/constants/drawing-dimensions-validation';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { GridService } from '@app/drawing/services/grid.service';
import { SettingsService } from '@app/modals/services/settings.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';

// tslint:disable: no-string-literal

describe('SettingsService', () => {
    let service: SettingsService;
    let settingsFormGroup: FormGroup;
    let initialBackgroundColorSpyObj: jasmine.SpyObj<Color>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let gridServiceSpyObj: jasmine.SpyObj<GridService>;
    let themeServiceSpyObj: jasmine.SpyObj<ThemeService>;

    const initialDrawingDimensions: Vec2 = { x: 10, y: 10 };
    const initialThemeColor = 'initialColor';
    const initialGridSize = 20;
    const initialGridOpacity = 1;
    const minimumGridSize = 10;
    const maximumGridSize = 250;
    const minimumGridOpacity = 0.1;
    const maximumGridOpacity = 1;

    beforeEach(() => {
        initialBackgroundColorSpyObj = jasmine.createSpyObj('Color', ['clone']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            dimensions: initialDrawingDimensions,
            backgroundColor: initialBackgroundColorSpyObj,
        });
        gridServiceSpyObj = jasmine.createSpyObj('GridService', [], {
            isDisplayEnabled: true,
            size: initialGridSize,
            minimumSize: 10,
            maximumSize: 100,
            opacity: initialGridOpacity,
            minimumOpacity: 0,
            maximumOpacity: 1,
        });
        themeServiceSpyObj = jasmine.createSpyObj('ThemeService', [], {
            color: initialThemeColor,
            isDarkTheme: true,
        });

        TestBed.configureTestingModule({
            providers: [
                SettingsService,
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: GridService, useValue: gridServiceSpyObj },
                { provide: ThemeService, useValue: themeServiceSpyObj },
            ],
        });
        service = TestBed.inject(SettingsService);
        settingsFormGroup = service['settingsFormGroup'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#resetInitialSettings should reset drawingsService's dimensions to its initial value", () => {
        const drawingServiceMock = ({ dimensions: { x: 0, y: 0 }, backgroundColor: {} as Color } as unknown) as DrawingService;
        service['drawingService'] = drawingServiceMock;
        service['initialBackgroundColor'] = initialBackgroundColorSpyObj;
        service.resetInitialSettings();

        expect(drawingServiceMock.dimensions).toEqual(initialDrawingDimensions);
        expect(drawingServiceMock.backgroundColor).toBe(initialBackgroundColorSpyObj);
    });

    it("#resetInitialSettings should reset gridService's attributes to their initial values", () => {
        const gridServiceMock = ({ isDisplayEnabled: false, size: 10, opacity: 0 } as unknown) as GridService;
        service['gridService'] = gridServiceMock;
        service.resetInitialSettings();

        expect(gridServiceMock.isDisplayEnabled).toEqual(true);
        expect(gridServiceMock.size).toEqual(initialGridSize);
        expect(gridServiceMock.opacity).toEqual(initialGridOpacity);
    });

    it("#resetInitialSettings should reset themeService's attributes to their initial values", () => {
        const themeServiceMock = ({ color: 'Changed', isDarkTheme: false } as unknown) as ThemeService;
        service['themeService'] = themeServiceMock;
        service.resetInitialSettings();

        expect(themeServiceMock.color).toEqual(initialThemeColor);
        expect(themeServiceMock.isDarkTheme).toEqual(true);
    });

    it("#resetInitialSettings should reset the formGroup's values to their initial values", () => {
        const drawingWidthSpy = spyOn(service['settingsFormGroup'].controls.drawingWidth, 'reset');
        const drawingHeightSpy = spyOn(service['settingsFormGroup'].controls.drawingHeight, 'reset');
        const gridDisplayEnabledSpy = spyOn(service['settingsFormGroup'].controls.gridDisplayEnabled, 'reset');
        const gridSizeSpy = spyOn(service['settingsFormGroup'].controls.gridSize, 'reset');
        const gridOpacitySpy = spyOn(service['settingsFormGroup'].controls.gridOpacity, 'reset');

        service.resetInitialSettings();

        expect(drawingWidthSpy).toHaveBeenCalledWith(initialDrawingDimensions.x);
        expect(drawingHeightSpy).toHaveBeenCalledWith(initialDrawingDimensions.y);
        expect(gridDisplayEnabledSpy).toHaveBeenCalledWith(service['initialIsGridDisplayEnabled']);
        expect(gridSizeSpy).toHaveBeenCalledWith(initialGridSize);
        expect(gridOpacitySpy).toHaveBeenCalledWith(initialGridOpacity);
    });

    it('drawingWidth should be valid if it is within the minimum/maximum and only contains intergers', () => {
        settingsFormGroup.controls.drawingWidth.setValue(DrawingDimensionsValidation.minimumDrawingDimension);
        expect(settingsFormGroup.valid).toEqual(true);
    });

    it('drawingWidth should be invalid if it contains anything else be intergers', () => {
        settingsFormGroup.controls.drawingWidth.setValue('a');
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('drawingWidth should be invalid if it is under the minimum dimension', () => {
        settingsFormGroup.controls.drawingWidth.setValue(DrawingDimensionsValidation.minimumDrawingDimension - 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('drawingWidth should be invalid if it is above the maximum dimension', () => {
        settingsFormGroup.controls.drawingWidth.setValue(DrawingDimensionsValidation.maximumDrawingDimension + 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('drawingHeight should be valid if it is within the minimum/maximum and only contains intergers', () => {
        settingsFormGroup.controls.drawingHeight.setValue(DrawingDimensionsValidation.minimumDrawingDimension);
        expect(settingsFormGroup.valid).toEqual(true);
    });

    it('drawingHeight should be invalid if it contains anything else be intergers', () => {
        settingsFormGroup.controls.drawingHeight.setValue('a');
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('drawingHeight should be invalid if it is under the minimum dimension', () => {
        settingsFormGroup.controls.drawingHeight.setValue(DrawingDimensionsValidation.minimumDrawingDimension - 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('drawingHeight should be invalid if it is above the maximum dimension', () => {
        settingsFormGroup.controls.drawingHeight.setValue(DrawingDimensionsValidation.maximumDrawingDimension + 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridSize should be valid if it is within the minimum/maximum and only contains intergers', () => {
        settingsFormGroup.controls.gridSize.setValue(minimumGridSize);
        expect(settingsFormGroup.valid).toEqual(true);
    });

    it('gridSize should be invalid if it contains anything else be intergers', () => {
        settingsFormGroup.controls.gridSize.setValue('a');
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridSize should be invalid if it is under the minimum dimension', () => {
        settingsFormGroup.controls.gridSize.setValue(minimumGridSize - 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridSize should be invalid if it is above the maximum dimension', () => {
        settingsFormGroup.controls.gridSize.setValue(maximumGridSize + 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridOpacity should be valid if it is within the minimum/maximum and only contains intergers', () => {
        settingsFormGroup.controls.gridOpacity.setValue(minimumGridOpacity);
        expect(settingsFormGroup.valid).toEqual(true);
    });

    it('gridOpacity should be invalid if it contains anything else be intergers', () => {
        settingsFormGroup.controls.gridOpacity.setValue('a');
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridOpacity should be invalid if it is under the minimum dimension', () => {
        settingsFormGroup.controls.gridOpacity.setValue(minimumGridOpacity - 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });

    it('gridOpacity should be invalid if it is above the maximum dimension', () => {
        settingsFormGroup.controls.gridOpacity.setValue(maximumGridOpacity + 1);
        expect(settingsFormGroup.valid).toEqual(false);
    });
});
