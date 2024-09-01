import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgReactiveFormValidateDirective } from './ng-reactive-form-validate.directive';
import { ERROR_MESSAGES, NgReactiveFormValidate } from './ng-reactive-form-validate.module';

@Component({
  selector: 'test-comp',
  template: `
    <form [formGroup]="form1">
      <label for="name">Name:</label>
      <input id="name" formControlName="name" />
      <span [ngReactiveFormValidate]="form1.controls.name"></span>
    </form>
  `,
})
class TestComponent {
  form1 = this.fb.group({
    name: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder) { }
}

describe('NgReactiveFormValidateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let spanElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, NgReactiveFormValidate],
      providers: [
        { provide: ERROR_MESSAGES, useValue: { required: "This field is required" } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    spanElement = fixture.debugElement.query(By.css('span')).nativeElement;
  });

  it('should apply default styles when defaultStyles is true', () => {
    // Triggering validation to apply styles
    component.form1.controls.name.markAsTouched();
    component.form1.controls.name.updateValueAndValidity();
    fixture.detectChanges();


    const padding = spanElement.style.padding;
    const fontSize = spanElement.style.fontSize;
    const color = spanElement.style.color;

    expect(padding).toBe('4px');
    expect(fontSize).toBe('0.9rem');
    expect(color).toBe('rgb(220, 53, 69)'); // #dc3545 in RGB
  });

  it('should show error message when control is invalid', () => {
    // Trigger form control to be invalid
    component.form1.controls.name.markAsTouched();
    fixture.detectChanges();

    // Check for the presence of error message
    const errorMessage = spanElement.innerText;
    expect(errorMessage).toContain('This field is required');
  });

  it('should hide error message when control is valid', () => {
    // Set control to a valid state
    component.form1.controls.name.setValue('Valid value');
    fixture.detectChanges();

    // Check that error message is not present
    const errorMessage = spanElement.innerText;
    expect(errorMessage).toBe('');
  });
});
