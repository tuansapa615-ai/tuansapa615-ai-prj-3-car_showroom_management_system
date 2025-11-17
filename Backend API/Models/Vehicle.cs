using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("vehicles")]
    public class Vehicle
    {
        [Key]
        public int VehicleID { get; set; }

        public int? Quantity { get; set; } 

        public string ModelNumber { get; set; } = string.Empty; 
        public string Name { get; set; } = string.Empty; 
        public string ImagePath { get; set; } = string.Empty; 

        public decimal Price { get; set; } 
        public DateTime ManufactureDate { get; set; } 
        public string Color { get; set; } = string.Empty; 
        public int Mileage { get; set; } 
        public string EngineType { get; set; } = string.Empty; 

        public VehicleStatus? Status { get; set; }  
        public VehicleCondition VehicleCondition { get; set; }

        public DateTime? RegistrationDate { get; set; }

        public int BrandID { get; set; }
        public virtual Brand? Brand { get; set; }

    }

    public enum VehicleStatus
    {
        Available,
        Sold
    }

    public enum VehicleCondition
    {
        New,
        Used
    }
}
