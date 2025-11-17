using Microsoft.AspNetCore.Mvc;
using Project3.Models;
using Project3.Models.Report;
using System;

namespace Project3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummaryReport(DateTime startDate, DateTime endDate)
        {
            try
            {
                // Call the service to get the summary report
                var summaryReport = await _reportService.GetSummaryReportAsync(startDate, endDate);
                return Ok(summaryReport);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating the report." }); 
            }
        }
        
    }
}
