using Application.Profiles;
using Application.Profiles.Commands;
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
            return HandleResult(await Mediator!.Send(new Details { Username = username }));
        }

        /// <summary>
        /// Edits the specified edit.
        /// </summary>
        /// <param name="edit">
        /// The edit.
        /// </param>
        [HttpPut]
        public async Task<IActionResult> Edit(Edit edit)
        {
            return HandleResult(await Mediator!.Send(edit));
        }
    }
}
