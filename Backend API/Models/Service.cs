using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("services")]
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceID { get; set; }

        [ForeignKey("VehicleSalesOrder")]
        public int SalesOrderID { get; set; }

        public DateTime ServiceDate { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Cost { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceType { get; set; }

        public virtual VehicleSalesOrder? VehicleSalesOrder { get; set; }
    }
}