using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("vehicle_sales_orders")]
    public class VehicleSalesOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SalesOrderID { get; set; }

        [ForeignKey("vehicles")]
        public int VehicleID { get; set; }
        public virtual Vehicle? Vehicle { get; set; }

        [ForeignKey("employees")]
        public int EmployeeID { get; set; }
        public virtual Employee? Employee { get; set; }

        [ForeignKey("customers")]
        public int CustomerID { get; set; }
        public virtual Customer? Customer { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [EnumDataType(typeof(SalesStatus))]
        public SalesStatus SalesStatus { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalPrice { get; set; }
    }

    public enum SalesStatus
    {
        Pending,
        Confirmed
    }
}
