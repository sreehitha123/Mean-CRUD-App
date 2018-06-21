import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PostService } from '../../auth/post.service';
import {AuthService} from '../../auth/auth.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
pPosts;
edPost = false;
newComment=[];
commentForm;

  constructor(private postService: PostService, private formBuilder:FormBuilder) {
    this.creatForm();
   }

  
goBack(){
  window.location.reload();
}
getP(){
  this.postService.getPosts().subscribe(data => {
    console.log(data);

    this.pPosts = data;
    console.log(this.pPosts[0].comments);
})
}

getC(id){
  this.postService.postC().subscribe(data=>{
    this.pPosts = data.comments;
    this.getP();
  })
}


likePost(id){
  this.postService.likePost(id).subscribe(data=>{
    
    this.getP();

  })
}
dislikePost(id){
  this.postService.dislikePost(id).subscribe(data=>{
    this.getP();
    
  })
}
deletePost(id){
  console.log('Delete function!!');
  
this.postService.deletePost(id).subscribe(()=>{
this.getP();
 
});
}

draftComment(id){
  this.newComment = [];
  this.newComment.push(id);
}


creatForm(){
this.commentForm = this.formBuilder.group({
comment:''
})
}

postComment(id){
  var comment = this.commentForm.get('comment').value;
 this.postService.postComment(id, comment).subscribe(data=>{
   this.getP();
   var index = this.newComment.indexOf(id);
   this.newComment.splice(index,1);
 
   this.commentForm.reset();
   
 });
  
}
  ngOnInit() {

 this.getP();
}
}
