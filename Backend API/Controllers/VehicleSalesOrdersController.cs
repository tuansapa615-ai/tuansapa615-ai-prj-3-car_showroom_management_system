using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleSalesOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleSalesOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSalesOrder([FromBody] VehicleSalesOrderDto dto)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(dto.VehicleID);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                if (vehicle.Quantity < dto.Quantity)
                {
                    return BadRequest(new { message = "Not enough vehicles in stock." });
                }

                var importOrder = await _context.VehicleImportOrders
                    .FirstOrDefaultAsync(x => x.VehicleID == dto.VehicleID);
                if (importOrder == null)
                {
                    return NotFound(new { message = "Import order not found." });
                }

                if (dto.OrderDate <= importOrder.OrderDate)
                {
                    return BadRequest(new { message = "OrderDate must be after the OrderDate in ImportOrder." });
                }

                var totalPrice = vehicle.Price * dto.Quantity;

                var newSalesOrder = new VehicleSalesOrder
                {
                    VehicleID = dto.VehicleID,
                    EmployeeID = dto.EmployeeID,
                    CustomerID = dto.CustomerID,
                    Quantity = (int)dto.Quantity,
                    OrderDate = dto.OrderDate,
                    TotalPrice = (decimal)totalPrice,
                    SalesStatus = dto.SalesStatus
                };

                await _context.VehicleSalesOrders.AddAsync(newSalesOrder);
                vehicle.Quantity -= dto.Quantity;

                vehicle.Status = vehicle.Quantity == 0 ? VehicleStatus.Sold : VehicleStatus.Available;

                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetSalesOrderById), new { id = newSalesOrder.SalesOrderID }, newSalesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleSalesOrder>>> GetAllSalesOrders()
        {
            try
            {
                var salesOrders = await _context.VehicleSalesOrders
                    .Include(s => s.Customer)
                    .Include(s => s.Employee)
                    .Include(s => s.Vehicle)
                    .ToListAsync();

                if (salesOrders == null || !salesOrders.Any())
                {
                    return NotFound(new { message = "No sales orders found." });
                }

                return Ok(salesOrders);
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.Error.WriteLine($"Error fetching sales orders: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching sales orders." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalesOrder(int id, [FromBody] VehicleSalesOrderDto dto)
        {
            try
            {
                var salesOrder = await _context.VehicleSalesOrders.FindAsync(id);
                if (salesOrder == null)
                {
                    return NotFound(new { message = "Sales order not found." });
                }

                var oldQuantity = salesOrder.Quantity;
                var vehicle = await _context.Vehicles.FindAsync(dto.VehicleID);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                var importOrder = await _context.VehicleImportOrders
                    .FirstOrDefaultAsync(x => x.VehicleID == dto.VehicleID);
                if (importOrder == null)
                {
                    return NotFound(new { message = "Import order not found." });
                }

                if (dto.OrderDate <= importOrder.OrderDate)
                {
                    return BadRequest(new { message = "OrderDate must be after the OrderDate in ImportOrder." });
                }

                salesOrder.VehicleID = dto.VehicleID;
                salesOrder.EmployeeID = dto.EmployeeID;
                salesOrder.CustomerID = dto.CustomerID;

                if (dto.Quantity.HasValue)
                {
                    if (vehicle.Quantity + oldQuantity < dto.Quantity)
                    {
                        return BadRequest(new { message = "Not enough vehicles in stock." });
                    }

                    salesOrder.Quantity = dto.Quantity.Value;
                    vehicle.Quantity += (oldQuantity - dto.Quantity.Value);
                    vehicle.Status = vehicle.Quantity == 0 ? VehicleStatus.Sold : VehicleStatus.Available;
                }

                salesOrder.TotalPrice = vehicle.Price * salesOrder.Quantity;
                salesOrder.OrderDate = dto.OrderDate;
                salesOrder.SalesStatus = dto.SalesStatus; // Update SalesStatus

                await _context.SaveChangesAsync();
                return Ok(new { message = "Sales order updated successfully.", salesOrder });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating sales order.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalesOrder(int id)
        {
            try
            {
                var salesOrder = await _context.VehicleSalesOrders.FindAsync(id);
                if (salesOrder == null)
                {
                    return NotFound(new { message = "Sales order not found." });
                }

                var vehicle = await _context.Vehicles.FindAsync(salesOrder.VehicleID);
                if (vehicle != null)
                {
                    vehicle.Quantity += salesOrder.Quantity;
                    vehicle.Status = vehicle.Quantity == 0 ? VehicleStatus.Sold : VehicleStatus.Available;
                    await _context.SaveChangesAsync();
                }

                _context.VehicleSalesOrders.Remove(salesOrder);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Sales order deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting sales order.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalesOrderById(int id)
        {
            try
            {
                var salesOrder = await _context.VehicleSalesOrders.FindAsync(id);
                if (salesOrder == null)
                {
                    return NotFound(new { message = "Sales order not found." });
                }
                return Ok(salesOrder);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching sales order.", error = ex.Message });
            }
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<VehicleSalesOrder>>> GetPendingSalesOrders()
        {
            try
            {
                var pendingOrders = await _context.VehicleSalesOrders
                    .Where(o => o.SalesStatus == SalesStatus.Pending)
                    .ToListAsync();
                return Ok(pendingOrders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching pending sales orders.", details = ex.Message });
            }
        }

        [HttpGet("confirmed")]
        public async Task<ActionResult<IEnumerable<VehicleSalesOrder>>> GetConfirmedSalesOrders()
        {
            try
            {
                var confirmedOrders = await _context.VehicleSalesOrders
                    .Where(o => o.SalesStatus == SalesStatus.Confirmed)
                    .ToListAsync();
                return Ok(confirmedOrders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching confirmed sales orders.", details = ex.Message });
            }
        }
    }

    public class VehicleSalesOrderDto
    {
        public int VehicleID { get; set; }
        public int EmployeeID { get; set; }
        public int CustomerID { get; set; }
        public int? Quantity { get; set; }
        public DateTime OrderDate { get; set; }
        public SalesStatus SalesStatus { get; set; } // Add this line
    }
}


