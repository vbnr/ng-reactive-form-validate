# Ng Form Reactive Validator

## Features

- **Automatic Form Control Validation**: Automatically manages form control validation and displays error messages based on validation rules.
- **Custom Error Messages**: Supports customizable error messages using static strings or observables.
- **Seamless Translation Integration**: Easily integrates with Transloco or other translation packages for internationalized error messages.
- **Default Styles**: Provides default styles that manage the visibility transitions of form validation labels. These styles include keyframe animations and CSS classes designed to smoothly show and hide validation messages.

## Installation

Install the library using npm:

```bash
npm install ng-reactive-form-validate
```

## Usage

### Importing the Module into a Standalone Component/App module

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    NgModuleFormValidator,
    TranslocoModule,
  ],
  providers: [
    {
      // The ERROR_MESSAGES token allows injecting custom error messages into NgFormValidatorService.
      // The service will use these messages for validating form controls.
      // Note: For Angular's built-in validators, you need to be aware of the specific object returned when an error occurs to handle it correctly.
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
  styleUrls: ['./app.component.scss'],
})
```

## Contributing

We welcome contributions to the `ng-reactive-form-validate` project. Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License
