# # Ng Reactive Form Validator

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

## Demo App Project
For detailed usage and examples, please refer to the demo app project included in the repository. This demo app is an excellent resource that showcases 
the full capabilities of the library. The provided example uses Transloco as the translation library, but you are free to use any other option. 
You can also display error messages directly without needing any translation services, providing a quick setup.

## Community and Support
 We welcome all questions, suggestions, and feedback. Your input is highly valued and can help shape the future development of the library. 
 Please feel free to open an issue or start a discussion in the repository to share your thoughts. Contributions are also highly encouraged!

## Contributing
We welcome contributions to the `ng-reactive-form-validate` project. Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License
