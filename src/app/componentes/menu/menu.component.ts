import { Component } from '@angular/core';
import { CognitoService } from '../../auth/cognito.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private cognitoService: CognitoService) {  }

  logout(){
    this.cognitoService.logout();
  }

}
