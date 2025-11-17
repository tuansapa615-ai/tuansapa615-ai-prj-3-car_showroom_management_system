using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;

namespace Project3.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployees()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                return Ok(employees);
            }
            catch (System.Exception ex)
            {
                // Log the error (not implemented here)
                return StatusCode(500, new { message = "Error fetching employees.", details = ex.Message });
            }
        }

        // Get employee by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = "Employee not found." });
                }
                return Ok(employee);
            }
            catch (System.Exception ex)
            {
                // Log the error (not implemented here)
                return StatusCode(500, new { message = "Error fetching employee.", details = ex.Message });
            }
        }

        // Create a new employee
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            try
            {
                await _context.Employees.AddAsync(employee);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.EmployeeID }, employee);
            }
            catch (System.Exception ex)
            {
                // Log the error (not implemented here)
                return BadRequest(new { message = "Error adding employee.", details = ex.Message });
            }
        }

        // Update employee information
        [HttpPut("{id}")]
        public async Task<ActionResult<Employee>> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.EmployeeID)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            try
            {
                var existingEmployee = await _context.Employees.FindAsync(id);
                if (existingEmployee == null)
                {
                    return NotFound(new { message = "Employee not found." });
                }

                // Update employee details
                existingEmployee.FirstName = employee.FirstName;
                existingEmployee.LastName = employee.LastName;
                existingEmployee.ContactNumber = employee.ContactNumber;
                existingEmployee.Email = employee.Email;
                existingEmployee.DateOfJoining = employee.DateOfJoining;

                _context.Employees.Update(existingEmployee);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Employee updated successfully.", employee = existingEmployee });
            }
            catch (System.Exception ex)
            {
                // Log the error (not implemented here)
                return StatusCode(500, new { message = "Error updating employee.", details = ex.Message });
            }
        }

        // Delete an employee
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = "Employee not found." });
                }

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Employee deleted successfully." });
            }
            catch (System.Exception ex)
            {
                // Log the error (not implemented here)
                return StatusCode(500, new { message = "Error deleting employee.", details = ex.Message });
            }
        }
    }
}
