using Application.Core;
using MediatR;

namespace Application.Comments.Queries
{
    public class GetAll : IRequest<Result<List<CommentDto>>>
    {
        public Guid EventId { get; set; }
    }
}
