import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';

@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [StudentComponent]
})
export class StudentModule {  
 }


 

