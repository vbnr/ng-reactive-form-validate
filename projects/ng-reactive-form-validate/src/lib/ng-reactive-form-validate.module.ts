import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import {
  ErrorMessage,
  NgReactiveFormValidateDirective,
} from './ng-reactive-form-validate.directive';
import { NgReactiveFormValidateService } from './ng-reactive-form-validate.service';

export const ERROR_MESSAGES = new InjectionToken<ErrorMessage>(
  'ERROR_MESSAGES'
);

@NgModule({
  imports: [CommonModule],
  declarations: [NgReactiveFormValidateDirective],
  exports: [NgReactiveFormValidateDirective],
  providers: [NgReactiveFormValidateService],
})
export class NgReactiveFormValidate {}
