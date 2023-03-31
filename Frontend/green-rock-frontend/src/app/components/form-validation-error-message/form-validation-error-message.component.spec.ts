import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidationErrorMessageComponent } from './form-validation-error-message.component';

describe('FormValidationErrorMessageComponent', () => {
  let component: FormValidationErrorMessageComponent;
  let fixture: ComponentFixture<FormValidationErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormValidationErrorMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormValidationErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
