namespace Application.Users
{
    /// <summary>
    /// The users handler interface.
    /// </summary>
    public interface IUsersHandler
    {
        /// <summary>
        /// Deletes the user and associated data asynchronous.
        /// </summary>
        /// <param name="username">The username.</param>
        Task<bool> DeleteUserAndAssociatedDataAsync(string username);
    }
}
