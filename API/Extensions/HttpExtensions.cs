using System.Text.Json;

namespace API.Extensions
{
    /// <summary>
    /// The http extensions class.
    /// </summary>
    public static class HttpExtensions
    {
        /// <summary>Adds the pagination header.</summary>
        /// <param name="response">The response.</param>
        /// <param name="currentPage">The current page.</param>
        /// <param name="itemsPerPage">The items per page.</param>
        /// <param name="totalItems">The total items.</param>
        /// <param name="totalPages">The total pages.</param>
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
        }
    }
}
