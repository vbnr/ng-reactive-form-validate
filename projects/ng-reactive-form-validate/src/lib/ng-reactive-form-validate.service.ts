import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ErrorMessage } from './ng-reactive-form-validate.directive';

@Injectable()
export class NgReactiveFormValidateService {
  getErrors(
    control: FormControl,
    errorMessages: ErrorMessage
  ): Observable<string> {
    for (const key in control.errors) {
      if (control.errors.hasOwnProperty(key)) {
        const field = control.errors[key];
        const message = this.getMessage(key, field, errorMessages);

        if (message instanceof Observable) {
          return message;
        } else {
          return of(message);
        }
      }
    }

    return of('');
  }

  shouldShowErrors(control: FormControl): boolean {
    return control && control.invalid && (control.dirty || control.touched);
  }

  private getMessage(
    type: string,
    params: any,
    errorMessages: ErrorMessage
  ): Observable<string> | string | never {
    const errorMessage = errorMessages[type];

    if (!errorMessage) {
      throw new Error(`No defined error message for validation: ${type}`);
    }

    if (errorMessage instanceof Observable) {
      return errorMessage;
    } else if (typeof errorMessage === 'function') {
      return errorMessage(params);
    } else if (typeof errorMessage === 'string') {
      return errorMessage;
    }

    throw new Error(`Unsupported error message type for validation: ${type}`);
  }
}
