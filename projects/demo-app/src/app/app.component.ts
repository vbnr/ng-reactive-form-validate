import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import {
  NgReactiveFormValidate,
  ERROR_MESSAGES,
} from 'ng-reactive-form-validate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgReactiveFormValidate, TranslocoModule],
  providers: [
    {
      provide: ERROR_MESSAGES,
      useFactory: (translocoService: TranslocoService) => {
        return {
          required: translocoService.selectTranslate('required'),
          minlength: (args: { requiredLength: number }): Observable<string> => {
            return translocoService.selectTranslate('minlength', {
              num: args.requiredLength,
            });
          },
        };
      },
      deps: [TranslocoService],
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo-app';

  form1 = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService
  ) {}
}
