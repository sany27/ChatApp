import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatsService } from '../../app/service/chats.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css'
})
export class SingupComponent {
SingupForm: FormGroup;
isFormSubmitted: boolean = false;


constructor(private fb : FormBuilder, private chatService : ChatsService){
  this.SingupForm = fb.group({
    name: ['',Validators.required ],
    email: ['',Validators.required],
    address : ['',Validators.required],
    password : ['',Validators.required]


  })
}

onSubmit() {
  if (this.SingupForm.valid) {
    this.isFormSubmitted = false;
    console.log(this.SingupForm.value)
    this.chatService.registerUser(this.SingupForm.value).subscribe(response =>{
      console.log("Register Sucessfull",response);
    }),
    this.SingupForm.reset();
  } else {
    this.isFormSubmitted = true;
    console.log('Form is not valid');
  }
}
get f() {
  return this.SingupForm.controls;
}
}
