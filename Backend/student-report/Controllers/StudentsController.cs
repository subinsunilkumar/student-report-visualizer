using Microsoft.AspNetCore.Mvc;
using student_report.Model;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace student_report.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class StudentsController : ControllerBase
    {
        static List<Student> students = new List<Student>();
        // GET: api/Students
        [HttpGet]
        public IEnumerable<Student> Get()
        {
            return students.OrderBy(x => x.Grade)
           .ToList();
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
            //Skip adding duplicate Record-TO DO
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
            //Clear all values
            students.Clear();
        }
    }
}
