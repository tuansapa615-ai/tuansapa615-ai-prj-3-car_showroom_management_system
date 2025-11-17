using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;

namespace Project3.Controllers
{
    [Route("api/vehicles")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VehicleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAllVehicles()
        {
            try
            {
                var vehicles = await _context.Vehicles
                    .Include(v => v.Brand)
                    .ToListAsync();
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch vehicles.", details = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicleById(int id)
        {
            try
            {
                var vehicle = await _context.Vehicles
                    .Include(v => v.Brand) // Include thông tin brand của vehicle
                    .FirstOrDefaultAsync(v => v.VehicleID == id); // Sử dụng FirstOrDefaultAsync để lấy vehicle theo ID

                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                return Ok(vehicle); // Trả về vehicle nếu tìm thấy
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch vehicle.", details = ex.Message });
            }
        }


        [HttpPost]
        public async Task<ActionResult<Vehicle>> CreateVehicle([FromForm] Vehicle vehicle, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid vehicle data.", details = ModelState });
            }

            // Business logic validation
            if (vehicle.VehicleCondition == VehicleCondition.New && vehicle.Mileage > 0)
            {
                return BadRequest(new { error = "Mileage must be 0 for new vehicles." });
            }
            if (vehicle.VehicleCondition == VehicleCondition.Used && vehicle.Mileage <= 0)
            {
                return BadRequest(new { error = "Mileage must be greater than 0 for used vehicles." });
            }

            if (imageFile != null)
            {
                // Define a path to save the uploaded images
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vehicles");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Create a unique file name for the image
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save the image to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                // Set the ImagePath property
                vehicle.ImagePath = $"/uploads/vehicles/{fileName}";
            }

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleById), new { id = vehicle.VehicleID }, vehicle);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> EditVehicle(int id, [FromForm] VehicleDTO vehicleDto)
        {
            if (id != vehicleDto.VehicleID)
            {
                return BadRequest(new { message = "Vehicle ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid vehicle data.", details = ModelState });
            }

            try
            {
                var existingVehicle = await _context.Vehicles.FindAsync(id);
                if (existingVehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                // Validate vehicle condition and mileage
                if (vehicleDto.VehicleCondition == VehicleCondition.New && vehicleDto.Mileage > 0)
                {
                    return BadRequest(new { error = "Mileage must be 0 for new vehicles." });
                }
                if (vehicleDto.VehicleCondition == VehicleCondition.Used && vehicleDto.Mileage <= 0)
                {
                    return BadRequest(new { error = "Mileage must be greater than 0 for used vehicles." });
                }

                // Update properties using DTO
                existingVehicle.Name = vehicleDto.Name;
                existingVehicle.ModelNumber = vehicleDto.ModelNumber;
                existingVehicle.Price = vehicleDto.Price;
                existingVehicle.ManufactureDate = vehicleDto.ManufactureDate;
                existingVehicle.Color = vehicleDto.Color;
                existingVehicle.Mileage = vehicleDto.Mileage;
                existingVehicle.EngineType = vehicleDto.EngineType;
                existingVehicle.VehicleCondition = vehicleDto.VehicleCondition;
                existingVehicle.BrandID = vehicleDto.BrandID;

                // Handle image upload if provided
                if (vehicleDto.ImageFile != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vehicles");

                    // Delete the old image if it exists
                    if (!string.IsNullOrEmpty(existingVehicle.ImagePath))
                    {
                        var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingVehicle.ImagePath.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(vehicleDto.ImageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await vehicleDto.ImageFile.CopyToAsync(fileStream);
                    }

                    existingVehicle.ImagePath = $"/uploads/vehicles/{fileName}";
                }

                _context.Entry(existingVehicle).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await VehicleExists(id))
                {
                    return NotFound(new { message = "Vehicle not found." });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to update vehicle.", details = ex.Message });
            }
        }



        [HttpGet("status")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> CheckVehicleStatus()
        {
            try
            {
                var vehicles = await _context.Vehicles.Where(v => v.Status == VehicleStatus.Available).ToListAsync();
                return Ok(new { available = vehicles });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error checking vehicle status.", details = ex.Message });
            }
        }

        [HttpGet("brand/{brandId}")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicleByBrandId(int brandId)
        {
            try
            {
                var vehicles = await _context.Vehicles.Where(v => v.BrandID == brandId).ToListAsync();

                if (!vehicles.Any())
                {
                    return NotFound(new { message = "No vehicles found for this brand." });
                }

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch vehicles by brand ID.", details = ex.Message });
            }
        }

        private async Task<bool> VehicleExists(int id)
        {
            return await _context.Vehicles.AnyAsync(e => e.VehicleID == id);
        }
        [HttpPost("upload/{vehicleId}")]
        public async Task<IActionResult> UploadVehicleImage(int vehicleId, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest(new { error = "No file uploaded or file is empty." });
            }

            try
            {
                var vehicle = await _context.Vehicles.FindAsync(vehicleId);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vehicles");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                vehicle.ImagePath = $"/uploads/vehicles/{fileName}";
                await _context.SaveChangesAsync();

                return Ok(new { imagePath = vehicle.ImagePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error uploading image.", details = ex.Message });
            }
        }
        
        [HttpGet("unregistered")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetUnregisteredVehicles()
        {
            try
            {
                var vehicles = await _context.Vehicles
                    .Where(v => v.RegistrationDate == null)
                    .Include(v => v.Brand)
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch unregistered vehicles.", details = ex.Message });
            }
        }

        [HttpGet("registered")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetRegisteredVehicles()
        {
            try
            {
                var vehicles = await _context.Vehicles
                    .Where(v => v.RegistrationDate != null)
                    .Include(v => v.Brand)
                    .ToListAsync();

                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to fetch registered vehicles.", details = ex.Message });
            }
        }

        [HttpPut("register/{vehicleId}")]
        public async Task<IActionResult> UpdateRegistrationDate(int vehicleId, [FromBody] RegistrationDTO registrationDto)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(vehicleId);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found." });
                }

                // Optionally validate the registration date
                if (registrationDto.RegistrationDate == default)
                {
                    return BadRequest(new { message = "Invalid registration date." });
                }

                vehicle.RegistrationDate = registrationDto.RegistrationDate;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Vehicle registration date updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error updating registration date.", details = ex.Message });
            }
        }

    }
    public class RegistrationDTO
    {
        public DateTime RegistrationDate { get; set; } 
    }

    public class VehicleDTO
    {
        public int VehicleID { get; set; }
        public string Name { get; set; }
        public string ModelNumber { get; set; }
        public decimal Price { get; set; }
        public DateTime ManufactureDate { get; set; }
        public string Color { get; set; }
        public int Mileage { get; set; }
        public string EngineType { get; set; }
        public VehicleCondition VehicleCondition { get; set; }
        public int BrandID { get; set; }
        public IFormFile ImageFile { get; set; }
        public virtual Brand? Brand { get; set; }
    }
}





