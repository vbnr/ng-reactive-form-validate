import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NgReactiveFormValidateService } from './ng-reactive-form-validate.service';
import { ErrorMessage } from './ng-reactive-form-validate.directive';

describe('NgReactiveFormValidateService', () => {
  let service: NgReactiveFormValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new NgReactiveFormValidateService();
  });

  describe('getErrors', () => {
    it('should return an observable with a string message if control has errors and message is a string', () => {
      const control = new FormControl('', { validators: [] });
      control.setErrors({ required: true });
      const errorMessages: ErrorMessage = {
        required: 'This field is required',
      };

      const result = service.getErrors(control, errorMessages);

      result.subscribe((message) => {
        expect(message).toBe('This field is required');
      });
    });

    it('should return an observable with a function-generated message if control has errors and message is a function', () => {
      const control = new FormControl('', { validators: [] });
      control.setErrors({ minlength: { requiredLength: 3, actualLength: 1 } });

      const errorMessages: ErrorMessage = {
        minlength: ({ requiredLength, actualLength }) =>
          of(`Minimum length is ${requiredLength}, but got ${actualLength}`),
      };

      const result = service.getErrors(control, errorMessages);

      result.subscribe((message) => {
        expect(message).toBe('Minimum length is 3, but got 1');
      });
    });

    it('should return an observable directly if the error message is an observable', () => {
      const control = new FormControl('', { validators: [] });
      control.setErrors({ required: true });
      const errorMessages: ErrorMessage = {
        required: of('Observable message'),
      };

      const result = service.getErrors(control, errorMessages);

      result.subscribe((message) => {
        expect(message).toBe('Observable message');
      });
    });

    it('should throw an error if there are no error messages defined', () => {
      const control = new FormControl('', { validators: [] });
      control.setErrors({ required: true });
      const errorMessages: ErrorMessage = {};

      expect(() => service.getErrors(control, errorMessages)).toThrowError(
        'No defined error message'
      );
    });
  });

  describe('shouldShowErrors', () => {
    it('should return true if control is invalid and dirty', () => {
      const control = new FormControl('', { validators: [] });
      control.markAsDirty();
      control.setErrors({ required: true });

      const result = service.shouldShowErrors(control);

      expect(result).toBe(true);
    });

    it('should return true if control is invalid and touched', () => {
      const control = new FormControl('', { validators: [] });
      control.markAsTouched();
      control.setErrors({ required: true });

      const result = service.shouldShowErrors(control);

      expect(result).toBe(true);
    });

    it('should return false if control is valid', () => {
      const control = new FormControl('', { validators: [] });
      control.markAsDirty();

      const result = service.shouldShowErrors(control);

      expect(result).toBe(false);
    });

    it('should return false if control is neither dirty nor touched', () => {
      const control = new FormControl('', { validators: [] });
      control.setErrors({ required: true });

      const result = service.shouldShowErrors(control);

      expect(result).toBe(false);
    });
  });

  describe('getMessage', () => {
    it('should return the error message string when provided', () => {
      const errorMessages: ErrorMessage = {
        required: 'This field is required',
      };

      const result = (service as any).getMessage(
        'required',
        null,
        errorMessages
      );

      expect(result).toBe('This field is required');
    });

    it('should return the result of the error message function when provided', () => {
      const errorMessages: ErrorMessage = {
        minlength: ({ requiredLength, actualLength }) =>
          of(`Minimum length is ${requiredLength}, but got ${actualLength}`),
      };

      const result = (service as any).getMessage(
        'minlength',
        { requiredLength: 3, actualLength: 1 },
        errorMessages
      );

      expect(result).toBe('Minimum length is 3, but got 1');
    });

    it('should return the observable directly if the error message is an observable', () => {
      const errorMessages: ErrorMessage = {
        required: of('Observable message'),
      };

      const result = (service as any).getMessage(
        'required',
        null,
        errorMessages
      );

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<string>).subscribe((message) => {
        expect(message).toBe('Observable message');
      });
    });

    it('should throw an error if no error message is defined for the type', () => {
      const errorMessages: ErrorMessage = {};

      expect(() =>
        (service as any).getMessage('required', null, errorMessages)
      ).toThrowError('No defined error message for validation: required');
    });
  });
});
