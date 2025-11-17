namespace Project3.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Fullname { get; set; }

        public string Username { get; set; } 
        public string Password { get; set; } 
        public int RoleID { get; set; } 
        public bool IsApproved { get; set; } 

        public void HashPassword()
        {
            Password = BCrypt.Net.BCrypt.HashPassword(Password);
        }
    }
}

