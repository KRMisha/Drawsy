// tslint:disable: no-string-literal
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from '@app/app/services/theme.service';

fdescribe('ThemeService', () => {
    let overlayContainerSpyObj: jasmine.SpyObj<OverlayContainer>;
    let classListSpyObj: jasmine.SpyObj<DOMTokenList>;
    let containerElementSpyObj: jasmine.SpyObj<HTMLElement>;
    let service: ThemeService;

    beforeEach(() => {
        classListSpyObj = jasmine.createSpyObj('DOMTokenList', ['add', 'replace']);
        containerElementSpyObj = jasmine.createSpyObj('HTMLElement', [], {
            classList: classListSpyObj,
        });
        overlayContainerSpyObj = jasmine.createSpyObj('OverlayContainer', ['getContainerElement']);
        overlayContainerSpyObj.getContainerElement.and.returnValue(containerElementSpyObj);
        TestBed.configureTestingModule({
            providers: [
                { provide: OverlayContainer, useValue: overlayContainerSpyObj },
            ],
        }).compileComponents();
        service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#toggleDarkTheme should invert isDarkTheme', () => {
        service['_isDarkTheme'] = true;
        service.toggleDarkTheme();
        expect(service['_isDarkTheme']).toBeFalsy();
        service.toggleDarkTheme();
        expect(service['_isDarkTheme']).toBeTruthy();
    });

    it('#get Theme should return a string with the color and "dark" when isDarkTheme is true', () => {
        service['_isDarkTheme'] = true;
        service['_color'] = 'orange';
        const returnValue = service.theme;
        expect(returnValue).toEqual('orange-dark-theme');
    });

    it('#get Theme should return a string with the color and "light" when isDarkTheme is false', () => {
        service['_isDarkTheme'] = false;
        service['_color'] = 'orange';
        const returnValue = service.theme;
        expect(returnValue).toEqual('orange-light-theme');
    });

    it('#get Color should return appropriate color', () => {
        service['_color'] = 'green';
        const returnValue = service.color;
        expect(returnValue).toEqual('green');
    });

    it('#set Color should change the color and the theme of the overlayContainer', () => {
        service['_color'] = 'yellow';
        service['_isDarkTheme'] = true;
        service.color = 'purple';
        expect(service['_color']).toEqual('purple');
        expect(classListSpyObj.replace).toHaveBeenCalledWith('yellow-dark-theme', 'purple-dark-theme');
    });

    it('#get isDarkTheme should return appropriate boolean value', () => {
        service['_isDarkTheme'] = false;
        const returnValue = service.isDarkTheme;
        expect(returnValue).toBeFalsy();
    });

    it('#set isDarkTheme should change isDarkTheme and the theme of the overlayContainer', () => {
        service['_isDarkTheme'] = false;
        service['_color'] = 'pink';
        service.isDarkTheme = true;
        expect(service['_isDarkTheme']).toBeTruthy();
        expect(classListSpyObj.replace).toHaveBeenCalledWith('pink-light-theme', 'pink-dark-theme');
    });
});
