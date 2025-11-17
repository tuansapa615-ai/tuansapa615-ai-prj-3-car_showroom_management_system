using Microsoft.EntityFrameworkCore;
using Project3.Data;
using Project3.Models;
using Project3.Models.Report;

public class ReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task<decimal> CalculateSalesRevenueAsync(DateTime startDate, DateTime endDate)
    {
        var soldOrders = await _context.VehicleSalesOrders
            .Where(s => s.OrderDate >= startDate && s.OrderDate <= endDate)
            .ToListAsync();

        decimal totalRevenue = 0;

        foreach (var order in soldOrders)
        {
            var vehicleImportOrders = await _context.VehicleImportOrders
                .Where(v => v.VehicleID == order.VehicleID)
                .ToListAsync();

            if (vehicleImportOrders == null || !vehicleImportOrders.Any())
                continue;

            decimal totalImportCost = vehicleImportOrders.Sum(v => v.TotalPrice);
            int totalImportedQuantity = vehicleImportOrders.Sum(v => v.Quantity);
            decimal averageImportCostPerVehicle = totalImportCost / totalImportedQuantity;

            decimal totalSellingPrice = order.TotalPrice;
            decimal importCostForSoldVehicles = averageImportCostPerVehicle * order.Quantity;

            decimal revenueFromOrder = totalSellingPrice - importCostForSoldVehicles;

            totalRevenue += revenueFromOrder;
        }

        return totalRevenue;
    }



    public async Task<SummaryReport> GetSummaryReportAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            throw new ArgumentException("Start date must be earlier than end date.");
        }

        var totalEmployees = await _context.Employees.CountAsync();
        var totalCustomers = await _context.Customers.CountAsync();

        var totalBillingAmount = await _context.Billings
            .Where(b => b.BillingDate >= startDate && b.BillingDate <= endDate)
            .SumAsync(b => b.TotalAmount);
        var totalSalesAmount = await _context.VehicleSalesOrders
            .Where(v => v.OrderDate >= startDate && v.OrderDate <= endDate)
            .SumAsync(v => v.TotalPrice);

        var totalVehicleImportOrdersAmount = await _context.VehicleImportOrders
            .Where(v => v.OrderDate >= startDate && v.OrderDate <= endDate)
            .SumAsync(v => v.TotalPrice);

        var totalVehicles = await _context.Vehicles.SumAsync(v => v.Quantity);

        var totalVehiclesSold = await _context.VehicleSalesOrders
            .Where(s => s.OrderDate >= startDate && s.OrderDate <= endDate)
            .SumAsync(s => s.Quantity);

        var totalVehiclesimport = await _context.VehicleImportOrders.SumAsync(s => s.Quantity);

        var totalPaidAmount = await _context.Billings
            .Where(b => b.PaymentStatus == PaymentStatus.Paid
                         && b.BillingDate >= startDate && b.BillingDate <= endDate)
            .SumAsync(b => b.TotalAmount);

        var totalUnpaidAmount = await _context.Billings
            .Where(b => b.PaymentStatus == PaymentStatus.Unpaid
                         && b.BillingDate >= startDate && b.BillingDate <= endDate)
            .SumAsync(b => b.TotalAmount);
        var totalRevenue = await CalculateSalesRevenueAsync(startDate, endDate);

        return new SummaryReport
        {
            TotalSalesAmount = totalSalesAmount,
            TotalVehiclesimport = totalVehiclesimport,
            TotalEmployees = totalEmployees,
            TotalCustomers = totalCustomers,
            TotalBillingAmount = totalBillingAmount,
            TotalPaidAmount = totalPaidAmount,
            TotalUnpaidAmount = totalUnpaidAmount,
            TotalVehicleImportOrdersAmount = totalVehicleImportOrdersAmount,
            TotalVehicles = totalVehicles,
            TotalRevenue = totalRevenue,
            TotalVehiclesSold = totalVehiclesSold

        };
    }
}
