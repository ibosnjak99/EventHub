using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Events
{
    /// <summary>
    /// The events service class.
    /// </summary>
    public class EventsService
    {
        /// <summary>
        /// Get all events class.
        /// </summary>
        /// <seealso cref="IRequest{TResponse}"/>
        public class GetAllEvents : IRequest<Result<List<Event>>>{ }

        /// <summary>
        /// The create event validator class.
        /// </summary>
        /// <seealso cref="AbstractValidator{CreateEvent}"/>
        public class CreateEventValidator : AbstractValidator<CreateEvent>
        {
            public CreateEventValidator()
            {
                RuleFor(e => e.Event).SetValidator(new EventValidator());
            }
        }

        /// <summary>
        /// The edit event validator class.
        /// </summary>
        /// <seealso cref="AbstractValidator{EditEvent}"/>
        public class EditEventValidator : AbstractValidator<EditEvent>
        {
            public EditEventValidator()
            {
                RuleFor(e => e.Event).SetValidator(new EventValidator());
            }
        }

        /// <summary>
        /// Get event class.
        /// </summary>
        /// <seealso cref="IRequest{TResponse}"/>
        public class GetEventById : IRequest<Result<Event>>
        {
            public GetEventById(Guid id)
            {
                Id = id;
            }

            public Guid Id { get; set; }
        }

        /// <summary>
        /// Create event class.
        /// </summary>
        /// <seealso cref="IRequest"/>
        public class CreateEvent : IRequest<Result<Unit>>
        {
            public CreateEvent(Event @event)
            {
                Event = @event;
            }

            public Event Event { get; set; }
        }

        /// <summary>
        /// Edit event class.
        /// </summary>
        /// <seealso cref="IRequest"/>
        public class EditEvent : IRequest<Result<Unit>>
        {
            public EditEvent(Event @event)
            {
                this.Event = @event;
            }

            public Event Event { get; set; }
        }

        /// <summary>
        /// Delete event class.
        /// </summary>
        /// <seealso cref="IRequest"/>
        public class DeleteEvent : IRequest<Result<Unit>>
        {
            public DeleteEvent(Guid id)
            {
                this.Id = id;
            }

            public Guid Id;
        }

        /// <summary>
        /// Events handler class.
        /// </summary>
        /// <seealso cref="IRequestHandler{TRequest}"/>
        public class EventsHandler : 
            IRequestHandler<GetAllEvents, Result<List<Event>>>, 
            IRequestHandler<GetEventById, Result<Event>>, 
            IRequestHandler<CreateEvent, Result<Unit>>,
            IRequestHandler<EditEvent, Result<Unit>>,
            IRequestHandler<DeleteEvent, Result<Unit>>
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
            public async Task<Result<List<Event>>> Handle(GetAllEvents request, CancellationToken cancellationToken)
            {
                return Result<List<Event>>.Success(await this.context.Events.ToListAsync());
            }

            /// <summary>
            /// Handles a GET request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            public async Task<Result<Event>> Handle(GetEventById request, CancellationToken cancellationToken)
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
            public async Task<Result<Unit>> Handle(CreateEvent request, CancellationToken cancellationToken)
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
            public async Task<Result<Unit>> Handle(EditEvent request, CancellationToken cancellationToken)
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
            public async Task<Result<Unit>> Handle(DeleteEvent request, CancellationToken cancellationToken)
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
}
