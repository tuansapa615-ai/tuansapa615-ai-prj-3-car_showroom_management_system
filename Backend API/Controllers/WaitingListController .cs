using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;
using Microsoft.Extensions.Logging;

namespace Project3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WaitingListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<WaitingListController> _logger;

        public WaitingListController(ApplicationDbContext context, ILogger<WaitingListController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WaitingList>> GetWaitingListById(int id)
        {
            try
            {
                var waitingList = await _context.WaitingLists
                    .Include(w => w.Customer)
                    .Include(w => w.Vehicle)
                    .FirstOrDefaultAsync(w => w.WaitingListID == id);

                if (waitingList == null)
                {
                    return NotFound(new { message = "Waiting list not found." });
                }

                return Ok(waitingList);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error fetching waiting list data.");
                return StatusCode(500, new { message = "Error fetching waiting list data." });
            }
        }
        [HttpPost]
        public async Task<ActionResult<WaitingList>> AddToWaitingList(WaitingList waitingList)
        {
            try
            {
                // Kiểm tra dữ liệu đầu vào
                if (waitingList == null)
                {
                    return BadRequest(new { message = "Invalid waiting list data." });
                }

                // Kiểm tra CustomerID có tồn tại trong bảng khách hàng không
                var customerExists = await _context.Customers.AnyAsync(c => c.CustomerID == waitingList.CustomerID);
                if (!customerExists)
                {
                    return BadRequest(new { message = "Invalid Customer ID. Customer does not exist." });
                }

                // Kiểm tra VehicleID có tồn tại trong bảng xe không
                var vehicleExists = await _context.Vehicles.AnyAsync(v => v.VehicleID == waitingList.VehicleID);
                if (!vehicleExists)
                {
                    return BadRequest(new { message = "Invalid Vehicle ID. Vehicle does not exist." });
                }

                // Kiểm tra yêu cầu chờ có bị trùng lặp không
                var existingRequest = await _context.WaitingLists
                    .AnyAsync(w => w.CustomerID == waitingList.CustomerID && w.VehicleID == waitingList.VehicleID);
                if (existingRequest)
                {
                    return Conflict(new { message = "Duplicate request. Customer has already requested this vehicle." });
                }

                // Thêm yêu cầu vào danh sách chờ
                _context.WaitingLists.Add(waitingList);
                await _context.SaveChangesAsync();

                // Trả về kết quả thành công
                return CreatedAtAction(nameof(GetWaitingListById), new { id = waitingList.WaitingListID }, waitingList);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error adding waiting list.");
                return StatusCode(500, new { message = "Error adding waiting list." });
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<WaitingList>>> GetAllWaitingLists()
        {
            try
            {
                var waitingRequests = await _context.WaitingLists
                    .Include(w => w.Customer)
                    .Include(w => w.Vehicle)
                    .ThenInclude(v => v.Brand)
                    .ToListAsync();

                return Ok(waitingRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching waiting list.");
                return StatusCode(500, new { message = "Error fetching waiting list.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromWaitingList(int id)
        {
            try
            {
                var request = await _context.WaitingLists.FindAsync(id);
                if (request == null)
                {
                    return NotFound(new { message = "Request not found." });
                }

                _context.WaitingLists.Remove(request);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Removed from waiting list successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing from waiting list.");
                return StatusCode(500, new { message = "Error removing from waiting list.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWaitingList(int id, WaitingList updatedWaitingList)
        {
            try
            {
                if (id != updatedWaitingList.WaitingListID)
                {
                    return BadRequest(new { message = "Mismatched Waiting List ID." });
                }

                var waitingList = await _context.WaitingLists.FindAsync(id);
                if (waitingList == null)
                {
                    return NotFound(new { message = "Waiting list not found." });
                }

                var customerExists = await _context.Customers.AnyAsync(c => c.CustomerID == updatedWaitingList.CustomerID);
                if (!customerExists)
                {
                    return BadRequest(new { message = "Invalid Customer ID. Customer does not exist." });
                }

                var vehicleExists = await _context.Vehicles.AnyAsync(v => v.VehicleID == updatedWaitingList.VehicleID);
                if (!vehicleExists)
                {
                    return BadRequest(new { message = "Invalid Vehicle ID. Vehicle does not exist." });
                }

                var existingRequest = await _context.WaitingLists
                    .AnyAsync(w => w.CustomerID == updatedWaitingList.CustomerID && w.VehicleID == updatedWaitingList.VehicleID && w.WaitingListID != id);
                if (existingRequest)
                {
                    return Conflict(new { message = "Duplicate request. Customer has already requested this vehicle." });
                }

                waitingList.CustomerID = updatedWaitingList.CustomerID;
                waitingList.VehicleID = updatedWaitingList.VehicleID;
                waitingList.RequestDate = updatedWaitingList.RequestDate;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Waiting list request updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating waiting list.");
                return StatusCode(500, new { message = "Error updating waiting list.", details = ex.Message });
            }
        }
    }
}



