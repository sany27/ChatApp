import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { SingupComponent } from '../pages/Singup/singup.component';
import { chatsGuard } from './guard/chats.guard';
import { HomeComponent } from '../component/home/home.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [chatsGuard]
    },
    {
        path: "login",
        component: LoginComponent,
        
    },
    {
        path : "register",
        component: SingupComponent
    }
];
