using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;
using System;
using System.Threading.Tasks;

namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BillingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/billing
        [HttpGet]
        public async Task<IActionResult> GetAllBillings()
        {
            try
            {
                var billings = await _context.Billings
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Customer)
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Vehicle)
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Employee)
                    .ToListAsync();

                return Ok(billings);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { message = "Error fetching billing documents.", details = ex.Message });
            }
        }

        // POST: api/billing
        [HttpPost]
        public async Task<IActionResult> CreateBilling([FromBody] BillingRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            // Validate PaymentStatus
            if (!Enum.TryParse<PaymentStatus>(request.PaymentStatus.ToString(), true, out var paymentStatus))
            {
                return BadRequest(new { message = "Invalid payment status." });
            }

            // Validate BillingDate
            if (!DateTime.TryParse(request.BillingDate, out var billingDate))
            {
                return BadRequest(new { message = "Invalid date format. Use 'yyyy-MM-dd' format." });
            }

            try
            {
                // Validate SalesOrderID
                var salesOrder = await _context.VehicleSalesOrders.FindAsync(request.SalesOrderID);
                if (salesOrder == null)
                {
                    return NotFound(new { message = "Sales order not found." });
                }

                // Validate ServiceID
                var service = await _context.Services.FindAsync(request.ServiceID);
                if (service == null)
                {
                    return NotFound(new { message = "Service not found." });
                }

                // Calculate TotalAmount
                var totalAmount = salesOrder.TotalPrice + service.Cost;

                // Update SalesStatus to 'Confirmed'
                salesOrder.SalesStatus = SalesStatus.Confirmed;
                await _context.SaveChangesAsync();

                // Create new Billing entry
                var newBilling = new Billing
                {
                    SalesOrderID = request.SalesOrderID,
                    ServiceID = request.ServiceID,  // Include the ServiceID in the new Billing
                    BillingDate = billingDate,
                    TotalAmount = totalAmount,
                    PaymentStatus = paymentStatus
                };

                _context.Billings.Add(newBilling);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBillingById), new { id = newBilling.BillingID }, new { message = "Billing document created successfully.", billing = newBilling });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { message = "Error creating billing document.", details = ex.Message });
            }
        }

        // GET: api/billing/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBillingById(int id)
        {
            try
            {
                var billing = await _context.Billings
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Customer)
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Vehicle)
                    .Include(b => b.VehicleSalesOrder)
                        .ThenInclude(vso => vso.Employee)
                    .FirstOrDefaultAsync(b => b.BillingID == id);

                if (billing == null)
                {
                    return NotFound(new { message = "Billing document not found." });
                }

                return Ok(billing);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { message = "Error fetching billing document.", details = ex.Message });
            }
        }


        // PUT: api/billing/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBilling(int id, [FromBody] BillingRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            // Validate PaymentStatus
            if (!Enum.TryParse<PaymentStatus>(request.PaymentStatus.ToString(), true, out var paymentStatus))
            {
                return BadRequest(new { message = "Invalid payment status." });
            }

            // Validate BillingDate
            if (!DateTime.TryParse(request.BillingDate, out var billingDate))
            {
                return BadRequest(new { message = "Invalid date format. Use 'yyyy-MM-dd' format." });
            }

            try
            {
                var existingBilling = await _context.Billings.FindAsync(id);
                if (existingBilling == null)
                {
                    return NotFound(new { message = "Billing document not found." });
                }

                // Validate SalesOrderID
                var salesOrder = await _context.VehicleSalesOrders.FindAsync(request.SalesOrderID);
                if (salesOrder == null)
                {
                    return NotFound(new { message = "Sales order not found." });
                }

                var service = await _context.Services.FindAsync(request.ServiceID);
                if (service == null)
                {
                    return NotFound(new { message = "Service not found." });
                }

                var totalAmount = salesOrder.TotalPrice + service.Cost;

                existingBilling.SalesOrderID = request.SalesOrderID;
                existingBilling.ServiceID = request.ServiceID;
                existingBilling.BillingDate = billingDate;
                existingBilling.PaymentStatus = paymentStatus;
                existingBilling.TotalAmount = totalAmount;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Billing document updated successfully.", billing = existingBilling });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { message = "Error updating billing document.", details = ex.Message });
            }
        }

        // DELETE: api/billing/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBilling(int id)
        {
            try
            {
                var billing = await _context.Billings.FindAsync(id);
                if (billing == null)
                {
                    return NotFound(new { message = "Billing document not found." });
                }

                _context.Billings.Remove(billing);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Billing document deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { message = "Error deleting billing document.", details = ex.Message });
            }
        }
    }

    public class BillingRequest
    {
        public int SalesOrderID { get; set; }
        public string BillingDate { get; set; }
        public int PaymentStatus { get; set; }
        public int ServiceID { get; set; }
    }
}
