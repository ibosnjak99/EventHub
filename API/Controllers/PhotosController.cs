using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// The photos controller class.
    /// </summary>
    /// <seealso cref="BaseApiController" />
    public class PhotosController : BaseApiController
    {
        /// <summary>
        /// Adds the specified command.
        /// </summary>
        /// <param name="command">
        /// The command.
        /// </param>
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        /// <summary>
        /// Deletes the specified command.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        /// <summary>
        /// Sets the profile image.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        [HttpPost("{id}/setProfile")]
        public async Task<IActionResult> SetProfile(string id)
        {
            return HandleResult(await Mediator.Send(new SetProfile.Command { Id= id }));
        }
    }
}
