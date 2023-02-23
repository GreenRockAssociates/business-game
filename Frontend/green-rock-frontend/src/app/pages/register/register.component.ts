import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  faChevronRight = faChevronRight;

  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  validationErrorMessages = {
    email: [
      {type: 'required', message: 'Email is required'},
      {type: 'email', message: 'Must be a valid email'}
    ],
    password: [
      {type: 'required', message: 'Password is required'},
    ],
    firstName: [
      {type: 'required', message: 'First name is required'},
    ],
    lastName: [
      {type: 'required', message: 'Last name is required'},
    ]
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  submitForm(){
    console.log("register")
    console.log(this.form)
  }

}
