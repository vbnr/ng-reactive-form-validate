import {
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { ERROR_MESSAGES } from './ng-reactive-form-validate.module';
import { NgReactiveFormValidateService } from './ng-reactive-form-validate.service';

type ErrorFunction = (params?: any) => Observable<string>;
export type ErrorMessage = Record<
  string,
  string | Observable<string> | ErrorFunction
>;

@Directive({
  selector: '[ngReactiveFormValidate]',
})
export class NgReactiveFormValidateDirective implements DoCheck, OnDestroy {
  @Input({ alias: 'ngReactiveFormValidate', required: true }) control!: FormControl;
  @Input() containerClass = 'ng-reactive-form-validate-container';
  @Input() defaultStyles = true;

  private destroySubject$ = new Subject<void>();

  constructor(
    @Inject(ERROR_MESSAGES)
    private errorMessages: ErrorMessage,
    private el: ElementRef,
    private renderer: Renderer2,
    private service: NgReactiveFormValidateService
  ) {}

  ngDoCheck() {
    const shouldShowErrors = this.service.shouldShowErrors(this.control);

    if (shouldShowErrors) {
      this.service
        .getErrors(this.control, this.errorMessages)
        ?.pipe(takeUntil(this.destroySubject$))
        .subscribe((message: string) => {
          this.setBaseStylesAndProps();
          this.setDefStyles();
          this.showMessage(message);
        });

      return;
    }

    this.hideMessage();
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  private showMessage(message: string) {
    this.renderer.removeClass(this.el.nativeElement, 'hide');
    this.renderer.addClass(this.el.nativeElement, 'show');

    this.renderer.setProperty(this.el.nativeElement, 'innerText', message);
  }

  private setBaseStylesAndProps() {
    this.renderer.removeClass(this.el.nativeElement, this.containerClass);
    this.renderer.addClass(this.el.nativeElement, this.containerClass);

    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

  private setDefStyles() {
    if (this.defaultStyles) {
      this.renderer.setStyle(this.el.nativeElement, 'padding', '4px');
      this.renderer.setStyle(this.el.nativeElement, 'font-size', '0.9rem');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#dc3545');
    }
  }

  private hideMessage() {
    this.renderer.removeClass(this.el.nativeElement, 'show');
    this.renderer.addClass(this.el.nativeElement, 'hide');

    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }
}
