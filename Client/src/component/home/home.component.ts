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
        console.log(this.currentUser.user);
        const admin_id = this.currentUser.user.id;
        if(this.currentUser.user.userType ==='admin'){
          this.user = data.users.filter((user: any) => user.IDs !== admin_id);
        }
        else{
          this.user = data.users.filter((user: any) => user.userType === "admin");
        }
      },
    });
    console.log('rubbbb')
   
    this.getOldChatsData()
    console.log(this.messages)
  }

  // get old chats data
  getOldChatsData(){
    this.chatApp.onMessage().subscribe((message: any) => {
      console.log(message);
      this.messages.push(message.message ? message.message : message);
      console.log(this.messages);
    });
  }
 

  userSelected(data: any) {
    console.log(data)
    this.recevierId = data.IDs;
    this.ischatOpen = true;
    const joinRoomData = {
      sender : this.currentUser.user.id,
      reciever : data.IDs,
    };
    this.userService.getChat(joinRoomData).subscribe({
      next: (res) => {
          // console.log(res.data);
          if(res.data){
            this.messages=[]
            res.data.map((msg: any)=> 
              this.messages.push(msg.message)
          );
          console.log(this.messages)
          }
      },
      error : (error) =>{
        console.log(error)
      }
    });
    this.chatApp.joinRoom(joinRoomData);
    this.id = this.currentUser.user.id;
    this.name = data.name;
    this.chatApp.reciverfunc(data, this.id);
  }
  fileUpload(event : Event){
    const uploads = event.target as HTMLInputElement;
    console.log(uploads.files);
  }
  messageSend() {
    console.log('hitt')
    const messagedata = {
      sender_id_ : this.currentUser.user.id,
      reciever_id : this.recevierId,
      message : this.message,

    };
    console.log("Message-data: ",messagedata);
    this.userService.saveChat(messagedata);
    this.chatApp.sendMessage(messagedata);
    this.message = '';
  }
}
