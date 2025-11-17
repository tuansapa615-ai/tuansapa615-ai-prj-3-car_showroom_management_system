using Microsoft.EntityFrameworkCore;
using Project3.Models;

namespace Project3.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Brand> Brands { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<WaitingList> WaitingLists { get; set; }
        public DbSet<Billing> Billings { get; set; }
        public DbSet<VehicleSalesOrder> VehicleSalesOrders { get; set; }
        public DbSet<VehicleImportOrder> VehicleImportOrders { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Header> Headers { get; set; }
        public DbSet<View> Views { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.VehicleCondition)
                .HasConversion<string>();

            modelBuilder.Entity<Billing>()
                .Property(b => b.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<VehicleSalesOrder>()
                .Property(v => v.SalesStatus)
                .HasConversion<string>();
        }
    }
}