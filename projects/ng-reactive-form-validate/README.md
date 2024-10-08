# Ng Reactive Form Validator

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

Add base styles to the angular.json file (optional)
Make sure to include the following styles under the "build" section of your angular.json file:
```bash
"build": {
    "styles": [
      "node_modules/ng-reactive-form-validate/src/lib/styles/index.scss"
     ],
}
```

## Usage

### Importing the Module into a Standalone Component/App module/Feature module

## Example: Using plain text error messages

```typescript
@Component({
  selector: 'standalone-comp',
  standalone: true,
  imports: [
    NgReactiveFormValidate,
    // ...Other modules
  ],
  providers: [
    {
      // It's mandatory to provide a key:value pair to the ERROR_MESSAGES injection token
      provide: ERROR_MESSAGES,
      useValue: {
        required: "Required",
        // Additional error messages can be added here
      },
    },
  ],
})
```

## Example: Using a Transloco service

```typescript
@Component({
  selector: 'standalone-comp',
  standalone: true,
  imports: [
    NgReactiveFormValidate,
    // ...Other modules
  ],
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
})
```

## License
This project is licensed under the MIT License

## Repository
For more details and examples of using it, visit my GitHub repository (https://github.com/vbnr/ng-reactive-form-validate).



