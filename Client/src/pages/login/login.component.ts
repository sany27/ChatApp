import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChatsService } from '../../app/service/chats.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private chatservice: ChatsService , private router : Router) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    if (this.loginForm.valid) {
      this.isFormSubmitted = false;
      this.chatservice.loginUser(this.loginForm.value).subscribe((response) => {
      
        if (response.success) {
          if (typeof localStorage !== 'undefined'){

            localStorage.setItem("Token",response.token)
          }

          this.loginForm.reset();
          this.router.navigate(['']);
          console.log(response.message);
        } else {
          console.log(response.message);
         
        }
      },
    (error) => {
      console.log(error)
    });
    } else {
      this.isFormSubmitted = true;
      console.log('Form is not valid');
    }
  }
  get f() {
    return this.loginForm.controls;
  }
}
