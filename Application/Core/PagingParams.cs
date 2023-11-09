namespace Application.Core
{
    /// <summary>
    /// The paging params.
    /// </summary>
    public class PagingParams
    {
        private const int MaxPageSize = 25;

        public int PageNumber { get; set; } = 1;

        private int defaultPageSize = 10;

        public int PageSize
        {
            get => defaultPageSize;
            set => defaultPageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}
