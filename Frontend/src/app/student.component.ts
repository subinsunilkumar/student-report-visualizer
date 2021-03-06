import { Component, OnInit } from '@angular/core';
import $ from "jquery";
import * as XLSX from 'xlsx';
import { STUDENTS } from './student.model';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})

export class StudentComponent implements OnInit {
  data: any;
  title: any = 'student-report';
  gradeList: any[] = []
  Students: STUDENTS[] = [];
  subjectIdList: any[] = [];
  selectedSubjects: any[] = [];
  selectedSubjectsTmp: any[] = [];
  baseUrl: any = 'https://localhost:49153/api/Students';

  //On Init Method
  ngOnInit() {
    this.get();
  }

  //Constructor for StudentComponent class
  constructor(private http: HttpClient) {
    console.log("Constructor Initialiazed");
  }

  //XLSX or CSV to JSON Convertor
  importData(event: any) {
    const file = event.target.files[0];
    console.log("Loading file =>" + file.name);
    const ext = file.name.split('.')[1];
    console.log("File extension was " + ext)
    if (ext == "xlsx") {
      let workBook: any = null;
      let jsonData: any = null;
      const reader = new FileReader();
      const file = event.target.files[0];
      console.log("Converting XLSX file to JSON")
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(jsonData.Marks);
        if (dataString.length > 0) {
          console.log("XLSX to JSON Conversion successfully finished!");
          this.post(jsonData.Marks);
          $('#importState').text('Import Success!');
        }
        else {
          console.error("XLSX to JSON Conversion failed!");
          $('#importState').text('Import Failed!');
        }
      }
      reader.readAsBinaryString(file);
    }
    else if (ext == "csv") {
      console.log("Converting CSV file to JSON")
      const reader = new FileReader();
      reader.onload = () => {
        var text: any = reader.result;
        var lines = text.split("\n");
        var result = [];
        var headers = lines[0].replace("\r", "").split(",");

        for (var i = 1; i < lines.length - 1; i++) {
          var obj: any = {};
          var currentline = lines[i].replace("\r", "").split(",");
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }
        var jsonData = JSON.stringify(result[0]);
        if (jsonData.length > 0) {
          console.log("CSV to JSON Conversion successfully finished!");
          this.post(result);
          $('#importState').text('Import Success!');
        }
        else {
          console.error("CSV to JSON Conversion failed!",);
          $('#importState').text('Import Failed!');
        }
      };
      reader.readAsText(file);
    }
    else {
      console.error("Invalid file extension! => " + ext)
    }
    $('#fileUpload').val('')
    setTimeout(() => {
      $('#importState').text('');
    }, 3200);
  }

  deleteDb() {
    this.delete(1);
  }

  //Selects Subjects based on slider position
  subjectSelector() {
    var sliderVal = $('#sliderVal').val();
    var sliderValNum = (Number(sliderVal)) / 6;
    this.selectedSubjectsTmp = [this.subjectIdList[sliderValNum], this.subjectIdList[sliderValNum + 1], this.subjectIdList[sliderValNum + 2]];
    this.subjectIdList.forEach(id => {
      if (this.selectedSubjectsTmp.includes(id)) {
        $(id).css('background-color', '#04ac6c')
        $(id).css('border', '2px solid white');
      }
      else {
        $(id).css('border', '2px solid #345898');
        $(id).css('background-color', '#4472c4');
      }
    });
  }

  //Selects Subjects based on slider position and shows table data for the corresponding subjects
  selectSubjects() {
    console.log("Slider value changed");
    this.subjectSelector();
    this.selectedSubjects = this.selectedSubjectsTmp;
    var totalWidth = 4 * this.gradeList.length;
    this.gradeList.forEach(grade => {
      var width = Number($("#" + grade).width());
      totalWidth = totalWidth + width;
      var widthForGrade = width / 2 - 5;
      $("#Grade-" + grade).css('margin-left', widthForGrade?.toString() + "px");
    });
    $('#sliderVal').attr({
      "max": (this.subjectIdList.length ) * 6 - 18,
    });
    $("#sliderCont").css('width', totalWidth + "px");
  }

  //HTTP Get Request 
  get() {
    console.log("GET Request to " + this.baseUrl);
    this.http.get(this.baseUrl, { responseType: 'text' }).subscribe((res) => {
      this.data = res
      this.Students = JSON.parse(this.data);
      this.gradeList = [];
      this.subjectIdList = [];
      this.Students.forEach(tmp => {
        this.gradeList.push(tmp.grade.toString())
      });
      this.gradeList = [...new Set(this.gradeList)].sort(function (a, b) {
        return (+a) - (+b);
      });
      this.gradeList.forEach(grade => {
        this.Students.forEach(student => {
          if (student.grade == grade) {
            this.subjectIdList.push('#' + student.grade + student.subject);
          }
        });
      })
      setTimeout(() => {
        this.selectSubjects();
      }, 100);
    })
  }

  //HTTP Post Request 
  post(value: any[]) {
    console.log("POST Request to " + this.baseUrl);
    this.http.post<any>(this.baseUrl, value).subscribe(data => {
      this.get();
      setTimeout(() => {
        this.selectSubjects();
      }, 200);
    })
  }

  //HTTP Put Request
  put(id: Number, value: String) {
    console.log("PUT Request to " + this.baseUrl);
    this.http.put<any>(this.baseUrl + "/" + id, value)
      .subscribe();
  }

  //HTTP Delete Request 
  delete(id: Number) {
    console.log("DELETE Request to " + this.baseUrl);
    this.http.delete(this.baseUrl + "/" + id).subscribe(
      data=>{
        window.location.reload();
      }
    );
  }
}