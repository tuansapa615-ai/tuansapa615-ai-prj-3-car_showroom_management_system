using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;

namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeaderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public HeaderController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Lấy danh sách tất cả headers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Header>>> GetHeaders()
        {
            return await _context.Headers.ToListAsync();
        }

        // Lấy header theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Header>> GetHeaderById(int id)
        {
            var header = await _context.Headers.FindAsync(id);

            if (header == null)
            {
                return NotFound("Header not found");
            }

            return Ok(header);
        }

        // Cập nhật header theo ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHeader(int id, Header header)
        {
            if (id != header.Id)
            {
                return BadRequest("Header ID mismatch");
            }

            var existingHeader = await _context.Headers.FindAsync(id);
            if (existingHeader == null)
            {
                return NotFound("Header not found");
            }

            // Cập nhật các thuộc tính của header
            existingHeader.ImgBanner = header.ImgBanner;
            existingHeader.Tile = header.Tile;
            existingHeader.Status = header.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Headers.Any(e => e.Id == id))
                {
                    return NotFound("Header not found");
                }
                throw; // Nếu có lỗi khác, ném lại ngoại lệ
            }

            return NoContent();
        }

        // Tải lên ảnh banner
        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadBanner([FromForm] IFormFile file, [FromForm] int headerId)
        {
            Console.WriteLine($"UploadBanner called with headerId: {headerId}");

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty or not selected");
            }

            var header = await _context.Headers.FindAsync(headerId);
            if (header == null)
            {
                return NotFound("Header not found");
            }

            var uploadsPath = Path.Combine(_env.WebRootPath, "Uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            if (!string.IsNullOrEmpty(header.ImgBanner))
            {
                var oldFilePath = Path.Combine(_env.WebRootPath, header.ImgBanner);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var fileName = Path.Combine(uploadsPath, Guid.NewGuid() + Path.GetExtension(file.FileName));

            using (var stream = new FileStream(fileName, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            header.ImgBanner = Path.Combine("Uploads", Path.GetFileName(fileName));
            _context.Entry(header).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(header.ImgBanner);
        }

    }
}
