using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project3.Models
{
    [Table("billing")]
    public class Billing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BillingID { get; set; }

        [ForeignKey("VehicleSalesOrder")]
        public int SalesOrderID { get; set; }

        [ForeignKey("Service")]
        public int ServiceID { get; set; }  // Add ServiceID here

        [Required]
        public DateTime BillingDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        public PaymentStatus PaymentStatus { get; set; }

        public virtual VehicleSalesOrder? VehicleSalesOrder { get; set; }
        public virtual Service? Service { get; set; }  // Optional: Navigation property for the Service
    }

    public enum PaymentStatus
    {
        Paid,
        Unpaid
    }
}
