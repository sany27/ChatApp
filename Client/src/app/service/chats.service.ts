import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  
  constructor(private httpClient: HttpClient) {}
  registerUser(data: any): Observable<any> {
    return this.httpClient.post('http://localhost:8000/user', data);
  }

  saveChat(data: any): Observable<any> {
    return this.httpClient.post('http://localhost:8000/savechat',data);
  }

  getChat(data:any):Observable<any>{
    const params = new HttpParams()
    .set('sender_id', data.sender)
    .set('reciever_id', data.reciever );
    return this.httpClient.get('http://localhost:8000/chats',{params})
  }
  
  allUser(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('Token');
      if (token) {
        const decode = jwtDecode(token);
        console.log('Decoded : ', decode);

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.httpClient.get('http://localhost:8000/user', { headers });
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }
  getUser() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('Token');
      if (token) {
        const decode = jwtDecode(token);
        console.log('Decoded : ', decode);
        return decode;
      }else {
        return false;
      }
    }else{
      return null;
    }
  }
  // getselectedUser (): Observable<any>{
  //   if(typeof localStorage !== undefined){
  //     const token = localStorage.getItem('Token');

  //     if(token){

  //     }
  //   }

  //   return of(null);

  // }

  loginUser(data: any): Observable<any> {
    return this.httpClient.post('http://localhost:8000/login', data);
  }

  isAuthenticated() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('Token');
      if (!token) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  // sendMessages(){
  //   console.log("Excellence");
  // }
}
