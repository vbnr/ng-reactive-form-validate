import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ErrorMessage,
  NgReactiveFormValidateDirective,
} from './ng-reactive-form-validate.directive';
import { ERROR_MESSAGES } from './ng-reactive-form-validate.module';
import { NgReactiveFormValidateService } from './ng-reactive-form-validate.service';

@Component({
  template: `<div [ngReactiveFormValidate]="control"></div>`,
})
class TestComponent {
  control = new FormControl('');
}

describe('NgReactiveFormValidateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let el: ElementRef;
  let renderer: Renderer2;
  let directive: NgReactiveFormValidateDirective;
  let service: NgReactiveFormValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NgReactiveFormValidateDirective],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: ERROR_MESSAGES,
          useValue: { required: 'This field is required' } as ErrorMessage,
        },
        NgReactiveFormValidateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    // Manually create instances for testing
    el = fixture.debugElement.children[0];
    renderer = fixture.componentRef.injector.get(Renderer2);
    service = TestBed.inject(NgReactiveFormValidateService);
    directive = new NgReactiveFormValidateDirective(
      TestBed.inject(ERROR_MESSAGES),
      el,
      renderer,
      service
    );

    directive.control = component.control;
  });

  it('should apply default styles when defaultStyles is true', () => {
    spyOn(renderer, 'setStyle').and.callThrough();
    directive.defaultStyles = true;

    directive['setDefStyles']();

    expect(renderer.setStyle).toHaveBeenCalledWith(
      el.nativeElement,
      'padding',
      '4px'
    );
    expect(renderer.setStyle).toHaveBeenCalledWith(
      el.nativeElement,
      'font-size',
      '0.9rem'
    );
    expect(renderer.setStyle).toHaveBeenCalledWith(
      el.nativeElement,
      'color',
      '#dc3545'
    );
  });

  it('should not apply default styles when defaultStyles is false', () => {
    spyOn(renderer, 'setStyle').and.callThrough();
    directive.defaultStyles = false;

    directive['setDefStyles']();

    expect(renderer.setStyle).not.toHaveBeenCalledWith(
      el.nativeElement,
      'padding',
      '4px'
    );
    expect(renderer.setStyle).not.toHaveBeenCalledWith(
      el.nativeElement,
      'font-size',
      '0.9rem'
    );
    expect(renderer.setStyle).not.toHaveBeenCalledWith(
      el.nativeElement,
      'color',
      '#dc3545'
    );
  });

  it('should properly set base styles and properties', () => {
    spyOn(renderer, 'removeClass').and.callThrough();
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'setStyle').and.callThrough();

    directive['setBaseStylesAndProps']();

    expect(renderer.removeClass).toHaveBeenCalledWith(
      el.nativeElement,
      'ng-reactive-form-validate-container'
    );
    expect(renderer.addClass).toHaveBeenCalledWith(
      el.nativeElement,
      'ng-reactive-form-validate-container'
    );
    expect(renderer.setStyle).toHaveBeenCalledWith(
      el.nativeElement,
      'display',
      'block'
    );
  });

  it('should add show class and set message text when showing message', () => {
    spyOn(renderer, 'removeClass').and.callThrough();
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'setProperty').and.callThrough();

    directive['showMessage']('This field is required');

    expect(renderer.removeClass).toHaveBeenCalledWith(el.nativeElement, 'hide');
    expect(renderer.addClass).toHaveBeenCalledWith(el.nativeElement, 'show');
    expect(renderer.setProperty).toHaveBeenCalledWith(
      el.nativeElement,
      'innerText',
      'This field is required'
    );
  });

  it('should add hide class and set display none when hiding message', () => {
    spyOn(renderer, 'removeClass').and.callThrough();
    spyOn(renderer, 'addClass').and.callThrough();
    spyOn(renderer, 'setStyle').and.callThrough();

    directive['hideMessage']();

    expect(renderer.removeClass).toHaveBeenCalledWith(el.nativeElement, 'show');
    expect(renderer.addClass).toHaveBeenCalledWith(el.nativeElement, 'hide');
    expect(renderer.setStyle).toHaveBeenCalledWith(
      el.nativeElement,
      'display',
      'none'
    );
  });

  it('should clean up observables on destroy', () => {
    spyOn(directive['destroySubject$'], 'next').and.callThrough();
    spyOn(directive['destroySubject$'], 'complete').and.callThrough();

    directive.ngOnDestroy();

    expect(directive['destroySubject$'].next).toHaveBeenCalled();
    expect(directive['destroySubject$'].complete).toHaveBeenCalled();
  });
});
