import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl} from "@angular/forms";

export interface ValidationErrorMessage {
  type: string;
  message: string;
}

@Component({
  selector: 'app-form-validation-error-message',
  templateUrl: './form-validation-error-message.component.html',
  styleUrls: ['./form-validation-error-message.component.css']
})
export class FormValidationErrorMessageComponent implements OnInit {

  @Input() control!: AbstractControl;

  @Input() validationErrorMessages: ValidationErrorMessage[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  invalidControl(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched)
  }

  getErrorMessagesForControl(): string[] {
    const errorMessageList: string[] = [];
    for (let validation of this.validationErrorMessages ?? []){
      if (this.control.hasError(validation.type)){
        errorMessageList.push(validation.message);
      }
    }
    return errorMessageList;
  }
}
