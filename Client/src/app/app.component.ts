import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavabrComponent } from "../component/navabr/navabr.component";
import { HomeComponent } from '../component/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavabrComponent,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat-app';
}
