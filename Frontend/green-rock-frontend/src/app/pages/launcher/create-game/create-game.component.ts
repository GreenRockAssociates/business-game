import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {LauncherService} from "../../../services/launcher-service/launcher.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  errorOccurred: boolean = false;

  validationErrorMessages = {
    name: [
      {type: 'required', message: 'The game needs a name'}
    ]
  }

  form = this.formBuilder.group({
    name: ['', Validators.required]
  })

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private launcherService: LauncherService
  ) { }

  ngOnInit(): void {
  }

  createGame() {
    this.launcherService.createGame(this.form.controls['name'].value as string).subscribe({
      next: _ => this.router.navigate(['/main/games']),
      error: error => {
        if (error.status === 401){
          this.router.navigate(['/login']);
        } else {
          this.errorOccurred = true;
        }
      }
    })
  }
}
