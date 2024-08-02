import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatsService } from '../../app/service/chats.service';

@Component({
  selector: 'app-navabr',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navabr.component.html',
  styleUrl: './navabr.component.css'
})
export class NavabrComponent implements OnInit {
  userLogin : boolean = false;
  constructor(private chat: ChatsService){}
  
  ngOnInit(): void {
    this.checkStatus();
  }
  checkStatus(){
  this.userLogin = this.chat.isAuthenticated();

}
logout(){
    console.log("Logout");
    localStorage.removeItem('Token');
    this.checkStatus();
  }
}
