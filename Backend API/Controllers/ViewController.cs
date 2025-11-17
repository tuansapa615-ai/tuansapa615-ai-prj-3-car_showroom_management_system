using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;


namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ViewController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<View>> GetView()
        {
            var viewData = await _context.Views.FirstOrDefaultAsync();
            if (viewData == null)
            {
                return NotFound();
            }
            return viewData;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateView(View view)
        {
            var viewData = await _context.Views.FirstOrDefaultAsync();
            if (viewData == null)
            {
                return NotFound();
            }
            viewData.urlFace = view.urlFace;
            viewData.urltwitter = view.urltwitter;
            viewData.urlinstagram = view.urlinstagram;
            viewData.mapType = view.mapType;
            viewData.Contact = view.Contact;
            viewData.ContactMap = view.ContactMap;
            viewData.Mail = view.Mail;
            viewData.ShowroomType = view.ShowroomType;
            viewData.FooterSlogan = view.FooterSlogan;
            viewData.ShopIntroduction = view.ShopIntroduction;

            _context.Entry(viewData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
    }
}
