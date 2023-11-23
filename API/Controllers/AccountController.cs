using API.DTOs;
using API.Services;
using Domain.Models;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    /// <summary>
    /// Account controller class.
    /// </summary>
    /// <seealso cref="ControllerBase" />
    [ApiController]
    [Route(("api/[controller]"))]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly TokenService tokenService;
        private readonly DataContext context;

        /// <summary>Initializes a new instance of the <see cref="AccountController" /> class.</summary>
        /// <param name="userManager">The user manager.</param>
        /// <param name="tokenService">The token service.</param>
        /// <param name="context"></param>
        public AccountController(
            UserManager<AppUser> userManager,
            TokenService tokenService, 
            DataContext context
            )
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
            this.context = context;
        }

        /// <summary>
        /// Logins the specified login dto.
        /// </summary>
        /// <param name="loginDto">The login dto.</param>
        /// <returns>
        /// User dto.
        /// </returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this.userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                await SetRefreshToken(user);
                return CreateUser(user);
            }

            return Unauthorized();
        }

        /// <summary>
        /// Registers the specified register dto.
        /// </summary>
        /// <param name="registerDto">The register dto.</param>
        /// <returns>
        /// User dto.
        /// </returns>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await userManager.Users.AnyAsync(u => u.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username is already taken.");
                return ValidationProblem();
            }

            if (await userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is already taken.");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUser(user);
            }

            return BadRequest(result.Errors);
        }

        /// <summary>
        /// Gets the current user.
        /// </summary>
        /// <returns>
        /// User dto.
        /// </returns>
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await this.userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUser(user);
        }

        /// <summary>
        /// Gets all users.
        /// </summary>
        /// <returns>
        /// User dto.
        /// </returns>
        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await this.userManager.Users.ToListAsync();

            var userDtos = users.Select(u => CreateUser(u));

            return Ok(userDtos);
        }

        /// <summary>
        /// Deletes the user.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <returns>
        /// Success message.
        /// </returns>
        [Authorize]
        [HttpDelete("{username}")]
        public async Task<ActionResult> DeleteUser(string username)
        {
            await DeleteUserAndAssociatedDataAsync(username);

            return Ok("User and associated data successfully deleted.");
        }

        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns>
        /// User dto.
        /// </returns>
        private UserDto CreateUser(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(x => x.IsProfile)?.Url,
                Token = tokenService.CreateToken(user),
                Username = user.UserName,
                IsModerator = user.IsModerator
            };
        }

        /// <summary>
        /// Refreshes the token.
        /// </summary>
        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await this.userManager.Users
                .Include(r => r.RefreshTokens)
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUser(user);
        }

        /// <summary>
        /// Sets the refresh token.
        /// </summary>
        /// <param name="user">
        /// The user.
        /// </param>
        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = this.tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await this.userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        /// <summary>
        /// Deletes the user and associated data asynchronous.
        /// </summary>
        /// <param name="username">The username.</param>
        public async Task<bool> DeleteUserAndAssociatedDataAsync(string username)
        {
            var user = await this.userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (user == null)
                throw new ArgumentException("User not found.");
            if (user.IsModerator)
                throw new ArgumentException("Cannot delete moderator.");

            using (var transaction = await this.context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Removing related entities first
                    var comments = await this.context.Comments.Where(c => c.AuthorId == user.Id).ToListAsync();
                    this.context.Comments.RemoveRange(comments);

                    var photos = await this.context.Photos.Where(p => p.AppUserId == user.Id).ToListAsync();
                    this.context.Photos.RemoveRange(photos);

                    var eventAttendees = await this.context.EventAttendees
                        .Where(ea => ea.AppUserId == user.Id && ea.IsHost).ToListAsync();
                    var eventIds = eventAttendees.Select(ea => ea.EventId).Distinct().ToList();

                    this.context.EventAttendees.RemoveRange(eventAttendees);

                    var events = await this.context.Events.Where(e => eventIds.Contains(e.Id)).ToListAsync();
                    this.context.Events.RemoveRange(events);

                    var userFollows = await this.context.UserFollowings
                        .Where(uf => uf.ObserverId == user.Id || uf.TargetId == user.Id).ToListAsync();
                    this.context.UserFollowings.RemoveRange(userFollows);

                    var refreshTokens = await this.context.RefreshToken.Where(rt => rt.AppUser.Id == user.Id).ToListAsync();
                    this.context.RefreshToken.RemoveRange(refreshTokens);

                    // Finally, removing the user
                    this.context.Users.Remove(user);

                    // Save all changes within a transaction
                    await this.context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    throw new Exception("Something went wrong during the deletion process.");
                }
            }
            return true;
        }
    }
}
