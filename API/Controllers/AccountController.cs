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
        /// Deletes the user and associated data asynchronous.
        /// </summary>
        /// <param name="username">The username.</param>
        public async Task<bool> DeleteUserAndAssociatedDataAsync(string username)
        {
            var user = await this.userManager.Users.SingleOrDefaultAsync(u => u.UserName == username) ?? throw new ArgumentException("User not found.");
            if (user.IsModerator) throw new ArgumentException("Cannot delete moderator.");

            try
            {
                this.context.Comments.RemoveRange(this.context.Comments.Where(c => c.AuthorId == user.Id));

                this.context.Photos.RemoveRange(this.context.Photos.Where(p => p.AppUserId == user.Id));

                var eventAttendees = this.context.EventAttendees.Where(ea => ea.AppUserId == user.Id && ea.IsHost).ToList();
                var eventIds = eventAttendees.Select(ea => ea.EventId).Distinct().ToList();

                this.context.EventAttendees.RemoveRange(eventAttendees);
                
                this.context.Events.RemoveRange(this.context.Events.Where(e => eventIds.Contains(e.Id)));

                this.context.UserFollowings.RemoveRange(this.context.UserFollowings.Where(uf => uf.ObserverId == user.Id || uf.TargetId == user.Id));

                this.context.Users.Remove(user);

                await this.context.SaveChangesAsync();
            }
            catch
            {
                throw new Exception("Something went wrong during the deletion process.");
            }

            return true;
        }

    }
}
