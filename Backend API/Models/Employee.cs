using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("employees")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeID { get; set; }

        [Required]
        [StringLength(100)] // Adjust length as needed
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)] // Adjust length as needed
        public string LastName { get; set; }

        [Required]
        [StringLength(15)] // Adjust length as needed for contact number
        [Phone] // Optional: Use Phone annotation for validation
        public string ContactNumber { get; set; }

        [Required]
        [EmailAddress] // Optional: Use EmailAddress annotation for validation
        [StringLength(255)] // Adjust length as needed
        public string Email { get; set; }

        [Required]
        public DateTime DateOfJoining { get; set; }
    }
}
