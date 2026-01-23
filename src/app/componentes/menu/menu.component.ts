import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private auth: AuthService) {  }

  logout(){
    this.auth.logout();
  }

}
