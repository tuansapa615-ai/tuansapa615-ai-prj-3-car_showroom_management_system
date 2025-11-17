using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("customers")]
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerID { get; set; }

        [Required]
        [StringLength(100)] 
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [StringLength(15)] 
        [Phone] 
        public string ContactNumber { get; set; }

        [Required]
        [EmailAddress] 
        [StringLength(255)] 
        public string Email { get; set; }

        [Required]
        [StringLength(255)] 
        public string Address { get; set; }
    }
}
