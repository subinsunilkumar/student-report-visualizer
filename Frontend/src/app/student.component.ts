import { Component,OnInit } from '@angular/core';
import $ from "jquery";
import * as XLSX from 'xlsx';
import { STUDENTS } from './student.model';
import { HttpClient,HttpErrorResponse, HttpHeaders  } from "@angular/common/http";
import { delay } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class AppComponent implements OnInit {
  data: any;
  title:any='student-report';
  gradeList:any[]=[]
  Students: STUDENTS[] = [];
  subjectIdList: any[]=[];
  subjectListStr : any[]=[];
  selectedSubjects:any[]=[];
  baseUrl:any='https://localhost:49153/api/Students';
  ngOnInit() {
    this.get();
    

    // setInterval(this.get,100);
  }

  importData(event:any)
  {
    const file = event.target.files[0];
    console.log("Loading file =>"+file.name);
    const ext = file.name.split('.')[1];
    console.log("File extension was "+ ext)
    if(ext =="xlsx")
    {
      let workBook:any = null;
      let jsonData:any = null;
      const reader = new FileReader();
      const file = event.target.files[0];
      console.log("Converting XLSX file to JSON")
      reader.onload = (ev) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial:any, name:any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(jsonData.Marks);
        if(dataString.length>0)
        {
          console.log("XLSX to JSON Conversion successfully finished!");
          this.post(jsonData.Marks);
          $('#importState').text('Import Success!');
        }
        else
        {
          console.error("XLSX to JSON Conversion failed!");
          $('#importState').text('Import Failed!');
        }
        
       
      }
      reader.readAsBinaryString(file);
    }
    else if(ext == "csv")
    {
      console.log("Converting CSV file to JSON")
      const reader = new FileReader();
      reader.onload = () => {
      var text:any = reader.result;
      var lines = text.split("\n");
      var result = [];
      var headers = lines[0].replace("\r", "").split(",");
  
      for (var i = 1; i < lines.length-1; i++) {
  
          var obj:any = {};
          var currentline = lines[i].replace("\r", "").split(",");
  
          for (var j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
          }
          result.push(obj);
  
      }
      var jsonData = JSON.stringify(result[0]);
      if(jsonData.length>0)
        {
          console.log("CSV to JSON Conversion successfully finished!");
          this.post(result);
          $('#importState').text('Import Success!');
        }
        else
        {
          console.error("CSV to JSON Conversion failed!",);
          $('#importState').text('Import Failed!');
        }
    
    };
     reader.readAsText(file);
    }
    else
    {
      console.error("Invalid file extension! => " +ext)
    }
    $('#fileUpload').val('')
    setTimeout(() => {
      $('#importState').text('');
    }, 3200);
  }

  deleteDb()
  {
    this.delete(1);
    window.location.reload();
  }

  selectSubjects() {
    console.log("Slider value changed");
    var sliderVal = $('#sliderVal').val();
    var sliderValNum =(Number(sliderVal))/6;
    // alert(this.subjectIdList.length)
    this.selectedSubjects = [this.subjectIdList[sliderValNum],this.subjectIdList[sliderValNum+1],this.subjectIdList[sliderValNum+2]];
    // alert(this.selectedSubjects)
    this.subjectIdList.forEach(id => {
      if(this.selectedSubjects.includes(id))
     {
      $(id).css('background-color', '#04ac6c')
      $(id).css('border', '2px solid white');
     }
     else
     {
      $(id).css('border', '2px solid #345898');
      $(id).css('background-color', '#4472c4');
     }
     });
     var totalWidth =4*this.gradeList.length;
     this.gradeList.forEach(grade => {
      var width = Number($("#"+grade).width());
      totalWidth=totalWidth+width;
      var widthForGrade = width/2- 5;
      $("#Grade-"+grade).css('margin-left', widthForGrade?.toString()+"px");
     });
     $('#sliderVal').attr({
      "max" : (this.subjectIdList.length-3)*6,        
    });
     $("#sliderCont").css('width',totalWidth+"px");
    // alert(totalWidth)
  }


  get(){
    console.log("GET Request to "+this.baseUrl);
    this.http.get(this.baseUrl,{responseType: 'text'}).subscribe((res)=>{
      this.data = res
      this.Students = JSON.parse(this.data);
      this.gradeList=[];
      this.subjectIdList=[];
      this.Students.forEach(tmp => {
        this.gradeList.push(tmp.grade.toString())
        this.subjectIdList.push('#'+tmp.grade+tmp.subject);
      });
      this.gradeList=[...new Set(this.gradeList)].sort(function(a,b) {
        return (+a) - (+b);});
      setTimeout(() => {
        this.selectSubjects();
      }, 100);
    })
    // alert()
  }
  
  postId:any;
  post(value:any[])
  {
    console.log("POST Request to "+this.baseUrl);
    const headers = { 'content-type': 'text/json' };
    value.forEach(val => {
      this.http.post<any>(this.baseUrl, val).subscribe(data => {
        this.get();
        setTimeout(() => {
          this.selectSubjects();
        }, 200);

    })
    });
    
  }

  put(id:Number,value:String)
  {
    console.log("PUT Request to "+this.baseUrl);
    const body = {"name":"Subin","grade":1,"subject":"Sub5","score":45};
        this.http.put<any>(this.baseUrl+"/"+id, value)
            .subscribe(data => this.postId = data.id);
  }

  delete(id:Number)
  {
    this.gradeList.forEach(grade => {
      $('#'+grade).remove();
    });
    console.log("DELETE Request to "+this.baseUrl);
    this.http.delete(this.baseUrl+"/"+id).subscribe();
  }


  constructor(private http: HttpClient){
    console.log("Constructor Initialiazed");
  }
}




