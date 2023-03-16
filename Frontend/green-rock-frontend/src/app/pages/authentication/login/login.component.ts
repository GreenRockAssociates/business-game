import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../../../services/authentication-service/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

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

  invalidCredentials: boolean = false;
  justRegistered: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.justRegistered = params['registered'] === 'true')
  }

  submitForm(){
    this.authenticationService.login({
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value}
    ).subscribe({
      next: _ => this.router.navigate(['/main']),
      error: _ => this.showInvalidCredentials()
    })
  }


  invalidCredentialsTimeout: NodeJS.Timeout | undefined;
  private showInvalidCredentials() {
    this.invalidCredentials = true;
    this.justRegistered = false;
    clearTimeout(this.invalidCredentialsTimeout);
    this.invalidCredentialsTimeout = setTimeout(() => this.invalidCredentials = false, 2000);
  }
}
