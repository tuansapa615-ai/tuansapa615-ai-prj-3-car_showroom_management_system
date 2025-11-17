namespace Project3.Models.Report
{
    public class SummaryReport
    {
        public int TotalEmployees { get; set; }
        public int TotalCustomers { get; set; }
        public decimal TotalBillingAmount { get; set; }
        public decimal TotalSalesAmount { get; set; }
        public decimal TotalVehicleImportOrdersAmount { get; set; }
        public int? TotalVehicles { get; set; }
        public int TotalVehiclesSold { get; set; }
        public int TotalVehiclesimport { get; set; }
        public decimal TotalPaidAmount { get; set; }  
        public decimal TotalUnpaidAmount { get; set; }
        public decimal TotalRevenue { get; set; }

        
    }
}
