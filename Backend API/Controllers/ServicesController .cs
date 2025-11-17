using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;

namespace Project3.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetAllServices()
        {
            try
            {
                var services = await _context.Services
                    .Include(s => s.VehicleSalesOrder)
                    .ThenInclude(vso => vso.Customer)  // Include related data if necessary
                    .Include(s => s.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Vehicle)
                    .Include(s => s.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Employee)
                    .ToListAsync();

                if (services == null || !services.Any())
                {
                    return NotFound(new { message = "No services found." });
                }

                return Ok(services);
            }
            catch (System.Exception ex)
            {
                // Log the exception (consider using a logging framework)
                return StatusCode(500, new { message = "Error fetching services.", details = ex.Message });
            }
        }

        // GET: api/services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetServiceById(int id)
        {
            try
            {
                var service = await _context.Services
                    .Include(s => s.VehicleSalesOrder)
                    .ThenInclude(vso => vso.Customer)  // Include related data if necessary
                    .Include(s => s.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Vehicle)
                    .Include(s => s.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Employee)
                    .FirstOrDefaultAsync(s => s.ServiceID == id); // Use FirstOrDefault for clarity

                if (service == null)
                {
                    return NotFound(new { message = "Service not found." });
                }

                return Ok(service);
            }
            catch (System.Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Error fetching service data.", details = ex.Message });
            }
        }



        // POST: api/services
        [HttpPost]
        public async Task<ActionResult<Service>> AddService(Service service)
        {
            // Validate that the provided SalesOrderID exists in the VehicleSalesOrders table
            var existingVehicleOrder = await _context.VehicleSalesOrders.FindAsync(service.SalesOrderID);
            if (existingVehicleOrder == null)
            {
                return BadRequest(new { message = "Invalid Sales Order ID. The specified sales order does not exist." });
            }

            // Validate required fields
            if (string.IsNullOrEmpty(service.Description) || string.IsNullOrEmpty(service.ServiceType) || service.Cost < 0)
            {
                return BadRequest(new { message = "Missing or invalid fields. Please check Description, ServiceType, and Cost." });
            }

            try
            {
                _context.Services.Add(service);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetServiceById), new { id = service.ServiceID }, service);
            }
            catch (DbUpdateException dbEx)
            {
                // Log database update exception details
                return StatusCode(500, new { message = "Database update error.", details = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (System.Exception ex)
            {
                // Log the general exception
                return StatusCode(500, new { message = "Error adding service.", details = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // PUT: api/services/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Service>> UpdateService(int id, Service service)
        {
            // Check if the service exists
            var existingService = await _context.Services.FindAsync(id);
            //if (existingService == null)
            //{
            //    return NotFound(new { message = "Service not found." });
            //}

            //// Validate that the provided VehicleID exists in the Vehicles table
            //var existingVehicle = await _context.Vehicles.FindAsync(service.SalesOrderID);
            //if (existingVehicle == null)
            //{
            //    return BadRequest(new { message = "The specified vehicle ID does not exist." });
            //}

            try
            {
                // Update properties
                existingService.SalesOrderID = service.SalesOrderID;
                existingService.ServiceDate = service.ServiceDate;
                existingService.Description = service.Description;
                existingService.Cost = service.Cost;
                existingService.ServiceType = service.ServiceType;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Service updated successfully.", service = existingService });
            }
            catch (System.Exception ex)
            {
                // Log the exception (consider using a logging framework)
                return StatusCode(500, new { message = "Error updating service.", details = ex.Message });
            }
        }


        // DELETE: api/services/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteService(int id)
        {
            try
            {
                var service = await _context.Services.FindAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Service not found." });
                }

                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Service deleted successfully." });
            }
            catch (System.Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "Error deleting service." });
            }
        }
    }
}






