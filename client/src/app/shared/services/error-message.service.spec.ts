import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import Regexes from '@app/shared/constants/regexes';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

fdescribe('ErrorMessageService', () => {
    let service: ErrorMessageService;
    let formControl: FormControl;
    const initialValue = 10;
    const minimumValue = 1;
    const maximumValue = 100;
    const minimumLength = 2;
    const maximumLength = 5;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ErrorMessageService }],
        });
        service = TestBed.inject(ErrorMessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getErrorMessage should return required error message when the value is empty', () => {
        formControl = new FormControl(initialValue, [Validators.required]);
        formControl.setValue('');
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = 'Champ obligatoire';
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it("#getErrorMessage should return the pattern when the value doesn't match the pattern", () => {
        formControl = new FormControl(initialValue, [Validators.pattern(Regexes.integerRegex)]);
        formControl.setValue('asdf');
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = Regexes.integerRegex.toString() + ' uniquement';
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it("#getErrorMessage should return human-friendly error message when the value doesn't match the pattern", () => {
        formControl = new FormControl(initialValue, [Validators.pattern(Regexes.integerRegex)]);
        formControl.setValue('asdf');
        const humanFriendlyMessage = 'This is a human-friendly message';
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl, humanFriendlyMessage);
        const expectedMessage = humanFriendlyMessage + ' uniquement';
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it('#getErrorMessage should return minimum error message when the value is under the minimum', () => {
        formControl = new FormControl(initialValue, [Validators.min(minimumValue)]);
        formControl.setValue(minimumValue - 1);
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = `Minimum: ${minimumValue}`;
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it('#getErrorMessage should return maximum error message when the value is under the maximum', () => {
        formControl = new FormControl(initialValue, [Validators.max(maximumValue)]);
        formControl.setValue(maximumValue + 1);
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = `Maximum: ${maximumValue}`;
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it('#getErrorMessage should return minimum length error message when the value shorter than the minimum length', () => {
        formControl = new FormControl(initialValue, [Validators.minLength(minimumLength)]);
        const valueUnderLengthLimit = '1';
        formControl.setValue(valueUnderLengthLimit);
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = `Minimum ${minimumLength} caractères`;
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it('#getErrorMessage should return maximum length error message when the value shorter than the maximum length', () => {
        formControl = new FormControl(initialValue, [Validators.maxLength(maximumLength)]);
        const valueOverLengthLimit = '123456';
        formControl.setValue(valueOverLengthLimit);
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = `Maximum ${maximumLength} caractères`;
        expect(returnedMessage).toEqual(expectedMessage);
    });

    it('#getErrorMessage should return empty string if no constraints', () => {
        formControl = new FormControl(initialValue, []);
        const value = '123456';
        formControl.setValue(value);
        const returnedMessage = ErrorMessageService.getErrorMessage(formControl);
        const expectedMessage = '';
        expect(returnedMessage).toEqual(expectedMessage);
    });
});
