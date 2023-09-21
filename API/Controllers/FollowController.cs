using Application.Followers;
using Application.Followers.Queries;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// The follow controller class.
    /// </summary>
    public class FollowController : BaseApiController
    {
        /// <summary>Follows the specified username.</summary>
        /// <param name="username">The username.</param>
        /// <returns>
        /// Result.
        /// </returns>
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator!.Send(new FollowToggle.Command { TargetUsername = username }));
        }

        /// <summary>Gets the followings.</summary>
        /// <param name="username">The username.</param>
        /// <param name="predicate">The predicate.</param>
        /// <returns>
        /// Result.
        /// </returns>
        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return HandleResult(await Mediator!.Send(new List{ Username = username, Predicate = predicate }));
        }
    }
}
