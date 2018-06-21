import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import{Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
toggleMenuItems : any = false;
  constructor(private _authService : AuthService,
    private router:Router) { }

  ngOnInit() {
    this._authService.authCheck$.subscribe((data) =>{
      this.toggleMenuItems = data;
console.log(data);
    });
    this.toggleMenuItems =this._authService.checkUserStatus();
    console.log( this.toggleMenuItems);
  }
  onLogoutClick(details){
    this._authService.logout(details);
   this.router.navigate(['/']);
  return false;
  }

}
