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
        public class GetAllEvents : IRequest<List<Event>>{}
        public class GetEventById : IRequest<Event>
        {
            public GetEventById(Guid id)
            {
                Id = id;
            }

            public Guid Id { get; set; }
        }
        
        public class CreateEvent : IRequest
        {
            public CreateEvent(Event @event)
            {
                Event = @event;
            }

            public Event Event { get; set; }
        }

        public class EditEvent : IRequest
        {
            public EditEvent(Event @event)
            {
                this.Event = @event;
            }

            public Event Event { get; set; }
        }

        public class DeleteEvent : IRequest
        {
            public DeleteEvent(Guid id)
            {
                this.Id = id;
            }

            public Guid Id;
        }

        public class EventsHandler : 
            IRequestHandler<GetAllEvents, List<Event>>, 
            IRequestHandler<GetEventById, Event>, 
            IRequestHandler<CreateEvent>,
            IRequestHandler<EditEvent>,
            IRequestHandler<DeleteEvent>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public EventsHandler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<List<Event>> Handle(GetAllEvents request, CancellationToken cancellationToken)
            {
                return await this.context.Events.ToListAsync();
            }

            public async Task<Event> Handle(GetEventById request, CancellationToken cancellationToken)
            {
                var singleEvent = await this.context.Events.FindAsync(request.Id);

                if (singleEvent != null)
                    return singleEvent;
                else
                    throw new Exception("Event not found");
            }

            public async Task<Unit> Handle(CreateEvent request, CancellationToken cancellationToken)
            {
                this.context.Events.Add(request.Event);

                await this.context.SaveChangesAsync();

                return Unit.Value;
            }

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
