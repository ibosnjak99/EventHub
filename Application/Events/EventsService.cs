using AutoMapper;
using Domain;
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
        public class GetAllEvents : IRequest<List<Event>>{}

        /// <summary>
        /// Get event class.
        /// </summary>
        /// <seealso cref="IRequest{TResponse}"/>
        public class GetEventById : IRequest<Event>
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
        public class CreateEvent : IRequest
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
        public class EditEvent : IRequest
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
        public class DeleteEvent : IRequest
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
            IRequestHandler<GetAllEvents, List<Event>>, 
            IRequestHandler<GetEventById, Event>, 
            IRequestHandler<CreateEvent>,
            IRequestHandler<EditEvent>,
            IRequestHandler<DeleteEvent>
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
            public async Task<List<Event>> Handle(GetAllEvents request, CancellationToken cancellationToken)
            {
                return await this.context.Events.ToListAsync();
            }

            /// <summary>
            /// Handles a GET request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            public async Task<Event> Handle(GetEventById request, CancellationToken cancellationToken)
            {
                var singleEvent = await this.context.Events.FindAsync(request.Id);

                if (singleEvent != null)
                    return singleEvent;
                else
                    throw new Exception("Event not found");
            }

            /// <summary>
            /// Handles a POST request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            public async Task<Unit> Handle(CreateEvent request, CancellationToken cancellationToken)
            {
                this.context.Events.Add(request.Event);

                await this.context.SaveChangesAsync();

                return Unit.Value;
            }

            /// <summary>
            /// Handles a PUT request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            public async Task<Unit> Handle(EditEvent request, CancellationToken cancellationToken)
            {
                var eventToEdit = await this.context.Events.FindAsync(request.Event.Id);

                if (eventToEdit == null)
                {
                    throw new Exception($"Event with Id {request.Event.Id} not found.");
                }

                this.mapper.Map(request.Event, eventToEdit);

                await this.context.SaveChangesAsync();

                return Unit.Value;
            }

            /// <summary>
            /// Handles a DELETE request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            public async Task<Unit> Handle(DeleteEvent request, CancellationToken cancellationToken)
            {
                var eventToDelete = await this.context.Events.FindAsync(request.Id);

                if (eventToDelete == null)
                {
                    throw new Exception($"Event with Id {request.Id} not found.");
                }

                this.context.Events.Remove(eventToDelete);

                await this.context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
