using Application.Comments.Commands;
using Application.Comments.Queries;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Models;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments
{
    /// <summary>
    /// The comments handler class.
    /// </summary>
    public class CommentsHandler : IRequestHandler<Create, Result<CommentDto>>, IRequestHandler<GetAll, Result<List<CommentDto>>>
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        private readonly IUserAccessor accessor;

        /// <summary>Initializes a new instance of the <see cref="CommentsHandler" /> class.</summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="accessor">The accessor.</param>
        public CommentsHandler(DataContext context, IMapper mapper, IUserAccessor accessor)
        {
            this.context = context;
            this.mapper = mapper;
            this.accessor = accessor;
        }

        /// <summary>Handles a request</summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Response from the request</returns>
        public async Task<Result<List<CommentDto>>> Handle(GetAll request, CancellationToken cancellationToken)
        {
            var comments = await this.context.Comments
                .Where(x => x.Event.Id == request.EventId)
                .OrderBy(x => x.CreatedAt)
                .ProjectTo<CommentDto>(this.mapper.ConfigurationProvider)
                .ToListAsync();

            return Result<List<CommentDto>>.Success(comments);
        }

        /// <summary>Handles a request</summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Response from the request</returns>
        public async Task<Result<CommentDto>> Handle(Create request, CancellationToken cancellationToken)
        {
            var @event = await this.context.Events.FindAsync(request.EventId);

            if (@event == null) return null;

            var user = await this.context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == this.accessor.GetUsername());

            var comment = new Comment
            {
                Author = user,
                Event = @event,
                Body = request.Body,
            };

            @event.Comments.Add(comment);

            var success = await this.context.SaveChangesAsync() > 0;

            if (success) return Result<CommentDto>.Success(this.mapper.Map<CommentDto>(comment));

            return Result<CommentDto>.Failure("Failed to add the comment.");
        }
    }
}
