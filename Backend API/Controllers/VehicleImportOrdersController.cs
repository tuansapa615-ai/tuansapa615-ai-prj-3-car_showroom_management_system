using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models; // Adjust the namespace as needed
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleImportOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleImportOrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<VehicleImportOrder>> CreateImportOrder([FromBody] VehicleImportOrderDto importOrderDto)
        {
            if (importOrderDto == null)
            {
                return BadRequest("Invalid import order data.");
            }

            var vehicle = await _context.Vehicles.FindAsync(importOrderDto.VehicleID);
            if (vehicle == null)
            {
                return NotFound(new { message = "Vehicle not found." });
            }
            if (importOrderDto.Quantity > 0)

                if (importOrderDto.OrderDate <= vehicle.ManufactureDate)
                {
                    return BadRequest(new { message = "OrderDate must be after ManufactureDate." });
                }
            if (importOrderDto.Quantity <= 0)
            {
                return BadRequest(new { message = "Quantity must be greater than 0." });
            }

            if (importOrderDto.TotalPrice <= 0)
            {
                return BadRequest(new { message = "TotalPrice must be greater than 0." });
            }
            var newImportOrder = new VehicleImportOrder
            {
                VehicleID = importOrderDto.VehicleID,
                OrderDate = importOrderDto.OrderDate,
                Quantity = importOrderDto.Quantity,
                TotalPrice = importOrderDto.TotalPrice,
            };

            // Update vehicle quantity
            vehicle.Quantity = (vehicle.Quantity ?? 0) + importOrderDto.Quantity;
            vehicle.Status = vehicle.Quantity == 0 ? VehicleStatus.Sold : VehicleStatus.Available;

            // Save changes
            _context.Vehicles.Update(vehicle);
            await _context.VehicleImportOrders.AddAsync(newImportOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetImportOrderById), new { id = newImportOrder.PurchaseOrderID }, newImportOrder);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleImportOrder>>> GetAllImportOrders()
        {
            try
            {
                var importOrders = await _context.VehicleImportOrders.Include(voi => voi.Vehicle).ToListAsync();
                return Ok(importOrders);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { message = "Error fetching import orders." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleImportOrder>> GetImportOrderById(int id)
        {
            var importOrder = await _context.VehicleImportOrders.Include(voi => voi.Vehicle).FirstOrDefaultAsync(voi => voi.PurchaseOrderID == id);
            if (importOrder == null)
            {
                return NotFound(new { message = "Import order not found." });
            }
            return Ok(importOrder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditImportOrder(int id, [FromBody] VehicleImportOrderDto importOrderDto)
        {
            if (importOrderDto == null)
            {
                return BadRequest("Invalid import order data.");
            }

            var importOrder = await _context.VehicleImportOrders.FindAsync(id);
            if (importOrder == null)
            {
                return NotFound(new { message = "Import order not found." });
            }

            var vehicle = await _context.Vehicles.FindAsync(importOrderDto.VehicleID);
            if (vehicle == null)
            {
                return NotFound(new { message = "Vehicle not found." });
            }

            // Validate OrderDate
            if (importOrderDto.OrderDate <= vehicle.ManufactureDate)
            {
                return BadRequest(new { message = "OrderDate must be after ManufactureDate." });
            }
            if (importOrderDto.Quantity <= 0)
            {
                return BadRequest(new { message = "Quantity must be greater than 0." });
            }

            if (importOrderDto.TotalPrice <= 0)
            {
                return BadRequest(new { message = "TotalPrice must be greater than 0." });
            }

            // Store old quantity for adjustment
            int oldQuantity = importOrder.Quantity;

            // Update fields
            importOrder.VehicleID = importOrderDto.VehicleID;
            importOrder.Quantity = importOrderDto.Quantity;
            importOrder.OrderDate = importOrderDto.OrderDate;
            importOrder.TotalPrice = importOrderDto.TotalPrice;

            // Adjust vehicle quantity accordingly
            vehicle.Quantity += (importOrderDto.Quantity - oldQuantity);
            vehicle.Status = vehicle.Quantity == 0 ? VehicleStatus.Sold : VehicleStatus.Available;

            _context.Vehicles.Update(vehicle);
            await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();

            return Ok(new { message = "Import order updated successfully.", importOrder });
        }
    }

    public class VehicleImportOrderDto
    {
        public int VehicleID { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}




