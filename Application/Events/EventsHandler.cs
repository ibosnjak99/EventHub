using Application.Core;
using Application.Events.Commands;
using Application.Events.Queries;
using AutoMapper;
using Domain;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Events
{
    /// <summary>
    /// Events handler class.
    /// </summary>
    /// <seealso cref="IRequestHandler{TRequest}"/>
    public class EventsHandler :
        IRequestHandler<GetAll, Result<List<Event>>>,
        IRequestHandler<GetById, Result<Event>>,
        IRequestHandler<Create, Result<Unit>>,
        IRequestHandler<Edit, Result<Unit>>,
        IRequestHandler<Delete, Result<Unit>>
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="EventsHandler" /> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        public EventsHandler(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        /// <summary>
        /// Handles a GET request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<Result<List<Event>>> Handle(GetAll request, CancellationToken cancellationToken)
        {
            return Result<List<Event>>.Success(await this.context.Events.ToListAsync());
        }

        /// <summary>
        /// Handles a GET request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<Result<Event>> Handle(GetById request, CancellationToken cancellationToken)
        {
            var singleEvent = await this.context.Events.FindAsync(request.Id);

            if (singleEvent == null) return Result<Event>.Failure("Failed to delete an event.");

            return Result<Event>.Success(singleEvent);
        }

        /// <summary>
        /// Handles a POST request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<Result<Unit>> Handle(Create request, CancellationToken cancellationToken)
        {
            this.context.Events.Add(request.Event);

            var result = await this.context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to create an event.");

            return Result<Unit>.Success(Unit.Value);
        }

        /// <summary>
        /// Handles a PUT request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<Result<Unit>> Handle(Edit request, CancellationToken cancellationToken)
        {
            var @event = await this.context.Events.FindAsync(request.Event.Id);

            if (@event == null) return Result<Unit>.Failure("Event not found.");

            this.mapper.Map(request.Event, @event);

            var result = await this.context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to edit an event.");

            return Result<Unit>.Success(Unit.Value);
        }


        /// <summary>
        /// Handles a DELETE request
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<Result<Unit>> Handle(Delete request, CancellationToken cancellationToken)
        {
            var @event = await this.context.Events.FindAsync(request.Id);

            if (@event == null) return Result<Unit>.Failure("Event not found.");

            this.context.Events.Remove(@event);

            var result = await this.context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete an event.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
