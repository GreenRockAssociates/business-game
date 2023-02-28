import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication-service/authentication.service";

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

  errorOccurred: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submitForm(){
    this.authenticationService.register({
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value},
    ).subscribe({
      next: r => {
        console.log(r)
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } })
      },
      error: e => {
        console.log(e)
        this.showError()
      },
      complete: () => console.log('Observer got a complete notification')
    })
  }

  private showError() {
    this.errorOccurred = true;
    setTimeout(() => this.errorOccurred = false, 2000);
  }
}
