import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PostService {

  constructor(private _http:HttpClient, private _authService:AuthService) { }
  addPost(post){
    return this._http.post("http://localhost:3000/post", post,{
      headers:new HttpHeaders().set('token', this._authService.checkUserStatus() )
   
  })
  
  
  }
  getPosts(){
    return this._http.get('http://localhost:3000/allposts',{ 
      headers:new HttpHeaders().set('token', this._authService.checkUserStatus())
      
   })
   }

getsinglePost(id){
  return this._http.get('http://localhost:3000/singlePost/'+id,{ 
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus())
    
 })
}

editPost(post){
  return this._http.put('http://localhost:3000/editpost',post, { 
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus())
    
 })
}
   deletePost(id){
    return this._http.delete("http://localhost:3000/deletepost/"+id,{
      headers:new HttpHeaders().set('token', this._authService.checkUserStatus() )
    });
   }  
likePost(id){
  const postData = {id:id};
  return this._http.put("http://localhost:3000/likePost/",postData, {
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus()) 
  })
    
}
dislikePost(id){
  const postData = {id:id};
  return this._http.put("http://localhost:3000/dislikePost/",postData,{
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus())
  })
}
getUserpost(post){
  return this._http.get("http://localhost:3000/userpost/"+ post, {
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus()) 
  })
}
postComment(id, comment){
  
  var postData = {
    id:id,
    comment: comment
  }
  console.log("post", postData);
  return this._http.post("http://localhost:3000/postcomment", postData,{
    headers:new HttpHeaders().set('token', this._authService.checkUserStatus() )
 
})

}
}