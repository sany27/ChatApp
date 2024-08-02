import { Component, input, OnInit } from '@angular/core';
import { ChatsService } from '../../app/service/chats.service';
import { ChatappService } from '../../app/service/Chats/chatapp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any[] = [];
  messages: any[] = [];
  message: any;
  currentUser: any;
  name: any;
  id: any;
  ischatOpen: boolean = false;
  recevierId: any = '';
  sendermsg: boolean =true;

  constructor(
    private userService: ChatsService,
    private chatApp: ChatappService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.userService.getUser();

    this.userService.allUser().subscribe({
      next: (data: any) => {
        const admin_id = this.currentUser.user.id;
        this.user = data.users.filter((user: any) => user.IDs !== admin_id);
      },
    });
    this.chatApp.onMessage().subscribe((message: any) => {
      this.messages.push(message);
      console.log(this.messages);
    });
  }
  userSelected(data: any) {
    this.recevierId = data.IDs;

    this.ischatOpen = true;
    const joinRoomData = {
      sender : this.currentUser.user.id,
      reciever : data.IDs,
    };

    this.chatApp.joinRoom(joinRoomData);

    this.id = this.currentUser.user.id;
    this.name = data.name;
    this.chatApp.reciverfunc(data, this.id);
  }

  messageSend() {
    console.log(this.currentUser);
    const messagedata = {

      sender : this.currentUser.user.id,
      reciever : this.recevierId,
      message : this.message,
    };
    this.chatApp.sendMessage(messagedata);
    console.log(this.message);
    this.message = '';
  }
}
