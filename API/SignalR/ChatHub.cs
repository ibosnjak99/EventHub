using Application.Comments.Commands;
using Application.Comments.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    /// <summary>
    /// The chat hub class.
    /// </summary>
    public class ChatHub : Hub
    {
        private readonly IMediator mediator;

        /// <summary>Initializes a new instance of the <see cref="ChatHub" /> class.</summary>
        /// <param name="mediator">The mediator.</param>
        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>Posts the comment.</summary>
        /// <param name="create">The create.</param>
        public async Task PostComment(Create create)
        {
            var comment = await this.mediator.Send(create);

            await Clients.Group(create.EventId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        /// <summary>Called when a new connection is established with the hub.</summary>
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var eventId = httpContext!.Request.Query["eventId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, eventId!);
            var result = await this.mediator.Send(new GetAll { EventId = Guid.Parse(eventId!) });

            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}
