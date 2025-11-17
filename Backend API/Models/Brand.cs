using System.ComponentModel.DataAnnotations;

namespace Project3.Models
{
    public class Brand
    {
        
            [Key]
            public int BrandID { get; set; }
            public string BrandName { get; set; }
        
    }
}
