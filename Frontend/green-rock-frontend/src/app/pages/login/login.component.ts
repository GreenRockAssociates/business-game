import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faChevronRight = faChevronRight;

  form: FormGroup = this.formBuilder.group({
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
    ]
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  submitForm(){
    console.log("login")
    console.log(this.form)
  }
}
