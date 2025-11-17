using Microsoft.AspNetCore.Mvc;
using Project3.Models;
//using System.Linq;
//using System.Threading.Tasks;
using Project3.Data;
//using System.Net.Mail;
//using System.Net;
//using System.Text.RegularExpressions;

namespace Project3.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            if (_context.Users.Any(u => u.Username == request.Username))
                return BadRequest("Username already exists");

            var user = new User
            {
                Username = request.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Fullname = request.Fullname, 
                RoleID = request.RoleID,
                IsApproved = false 
            };

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error. Please try again later.");
            }

            return Ok("User registered successfully and waiting for approval.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return BadRequest("Invalid username or password");

            if (!user.IsApproved)
                return BadRequest("Your account is not approved yet.");

            return Ok(new { Fullname = user.Fullname, RoleID = user.RoleID });
        }

        [HttpGet("pending-users")]
        public IActionResult GetPendingUsers()
        {
            var pendingUsers = _context.Users
                .Where(u => !u.IsApproved)
                .Select(u => new { u.UserID, u.Fullname, u.Username, u.RoleID })
                .ToList();

            return Ok(pendingUsers);
        }

        [HttpGet("confirmed-users")]
        public IActionResult GetConfirmedUsers()
        {
            var confirmedUsers = _context.Users
                .Where(u => u.IsApproved)
                .Select(u => new { u.UserID, u.Fullname, u.Username, u.RoleID })
                .ToList();

            return Ok(confirmedUsers);
        }

        [HttpPost("approve/{userId}")]
        public async Task<IActionResult> ApproveUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            user.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok("User approved successfully.");
        }
    }

    public class UserDto
    {
        public string Fullname { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int RoleID { get; set; }
    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
