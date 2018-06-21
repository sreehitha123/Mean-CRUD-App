import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import{Router} from '@angular/router';
import{CookieService} from 'ngx-cookie-service';
import{Subject} from 'rxjs/Subject';

@Injectable()

export class AuthService {

  authCheck$ = new Subject<any>();
  user;
profile;
  constructor(private _http:HttpClient, private _router:Router, private _cookieService: CookieService) { }
login(details:any){
this._http.post('http://localhost:3000/authenticate', details).subscribe((data:any)=>{
  console.log(data);
if(data.isLoggedIn){
  this._cookieService.set('token', data.token);
  this.authCheck$.next(data.isLoggedIn);
this._router.navigate(['/home']);
}
});
}
checkUserStatus(){
 return this._cookieService.get('token');
}
addUser(user){
  return this._http.post("http://localhost:3000/register", user);
 }
 getHome(){
  return this._http.get('http://localhost:3000/homename',{ 
    headers:new HttpHeaders().set('token', this._cookieService.get('token'))
    
 })
}

logout(details:any){

  this._http.post('http://localhost:3000/authenticate', details).subscribe((data:any)=>{
if(!data.isLoggedIn){
  this._cookieService.delete('token', data.token);
 
this._router.navigate(['/login']);
}

});
}
}
