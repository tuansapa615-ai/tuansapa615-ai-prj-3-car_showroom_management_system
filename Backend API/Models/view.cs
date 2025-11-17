using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Project3.Models
{
    [Table("view")]
    public class View
    {
        [Key]
        public int Id { get; set; }
        public string Contact { get; set; }
        public string ContactMap { get; set; }
        public string Mail { get; set; }
        public string ShowroomType { get; set; }
        public string FooterSlogan { get; set; }
        public string ShopIntroduction { get; set; }
        public string mapType { get; set; }
        public string urlFace { get; set; }
        public string urltwitter { get; set; }
        public string urlinstagram { get; set; }
       
    }
}
