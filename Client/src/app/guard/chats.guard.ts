import { CanActivateFn, Router } from '@angular/router';
import { ChatsService } from '../service/chats.service';
import { inject } from '@angular/core';

export const chatsGuard: CanActivateFn = (route, state) => {
   const auth = inject(ChatsService)
   const router = inject(Router)
  if(auth.isAuthenticated()){

   
    return true;
  }
  else{
    router.navigate(["login"])
    return false;

  }
};
