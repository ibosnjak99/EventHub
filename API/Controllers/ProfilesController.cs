using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// The profiles controller class.
    /// </summary>
    /// <seealso cref="BaseApiController" />
    public class ProfilesController : BaseApiController
    {
        /// <summary>
        /// Gets the specified username.
        /// </summary>
        /// <param name="username">
        /// The username.
        /// </param>
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{ Username = username }));
        }
    }
}
