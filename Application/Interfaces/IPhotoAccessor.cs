using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    /// <summary>
    /// Photo accessor interface.
    /// </summary>
    public interface IPhotoAccessor
    {
        /// <summary>
        /// Adds the photo.
        /// </summary>
        /// <param name="file">
        /// The file.
        /// </param>
        Task<PhotoUploadResult> AddPhoto(IFormFile file);

        /// <summary>
        /// Deletes the photo.
        /// </summary>
        /// <param name="publicId">
        /// The public identifier.
        /// </param>
        Task<string> DeletePhoto(string publicId);
    }
}
