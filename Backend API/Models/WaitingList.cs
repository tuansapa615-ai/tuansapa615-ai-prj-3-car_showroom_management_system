using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    [Table("waitinglist")]
    public class WaitingList
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WaitingListID { get; set; }

        [ForeignKey("Customer")]
        public int CustomerID { get; set; }

        [ForeignKey("Vehicle")]
        public int VehicleID { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Vehicle? Vehicle { get; set; }
    }
}
