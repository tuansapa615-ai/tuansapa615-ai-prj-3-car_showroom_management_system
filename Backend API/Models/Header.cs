using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project3.Models
{
    [Table("header")]
    public class Header
    {
        public int Id { get; set; }

        [Required]
        public string ImgBanner { get; set; }

    
        public string Tile { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
