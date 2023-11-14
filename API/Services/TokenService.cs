using Domain.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
    /// <summary>
    /// Token service class.
    /// </summary>
    public class TokenService
    {
        private readonly IConfiguration config;

        /// <summary>
        /// Initializes a new instance of the <see cref="TokenService" /> class.
        /// </summary>
        /// <param name="config">The configuration.</param>
        public TokenService(IConfiguration config)
        {
            this.config = config;
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };

            if (user.IsModerator)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Moderator"));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Generates the refresh token.
        /// </summary>
        /// <returns>Refresh token.</returns>
        public RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return new RefreshToken { Token = Convert.ToBase64String(randomNumber) };
        }
    }
}
