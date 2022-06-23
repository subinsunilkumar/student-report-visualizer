using Microsoft.AspNetCore.Mvc;
using student_report.Model;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
namespace student_report.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class StudentsController : ControllerBase
    {
        static List<Student> students = new List<Student>()
            {
                new Student(){Name="Subin",Grade=1,Subject="Sub-5",Score=85},
                new Student(){Name="Subin",Grade=5,Subject="Sub-8",Score=91},
                new Student(){Name="Subin",Grade=8,Subject="Sub-12", Score = 98},
                new Student(){Name="Subin",Grade=1,Subject="Sub-9", Score = 89},
                new Student(){Name="Subin",Grade=5,Subject="Sub-2", Score = 86},
                new Student(){Name="Subin",Grade=5,Subject="Sub-15", Score = 93},
                new Student(){Name="Subin",Grade=9,Subject="Sub-18", Score = 82},
                new Student(){Name="Subin",Grade=6,Subject="Sub-14", Score = 88},
            };
        // GET: api/Students
        [HttpGet]
        public IEnumerable<Student> Get()
        {
            return students;
        }

        // GET api/Students/5
        [HttpGet("{id}")]
        public Student Get(int id)
        {
            return students[id];
        }

        // POST api/Students
        [HttpPost]
        public void Post([FromBody] Student value)
        {
            //Skip adding duplicate Record
            //var count =students.Count(tmp => (tmp.Name == value.Name && tmp.Subject == value.Subject && tmp.Score == value.Score && tmp.Grade == value.Grade));
            //if(count==0)
            students.Add(value);
        }

        // PUT api/Students/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Student value)
        {
            students[id] = value;

        }

        // DELETE api/Students/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            students.RemoveAt(id);
        }
    }
}
