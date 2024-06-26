﻿using Application.Events;
using Application.Events.Commands;
using Application.Events.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// The events controller class.
    /// </summary>
    /// <seealso cref="BaseApiController" />
    public class EventsController : BaseApiController
    {
        private readonly IMediator mediator;

        /// <summary>
        /// Initializes a new instance of the <see cref="EventsController" /> class.
        /// </summary>
        /// <param name="mediator"></param>
        public EventsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        // GET: /api/events 
        /// <summary>
        /// Gets the events asynchronous.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetEventsAsync([FromQuery] EventParams eventParams)
        {
            return HandlePagedResult(await this.mediator.Send(new GetAll { PagingParams = eventParams }));
        }

        // GET: /api/events/{id}
        /// <summary>
        /// Gets the single event asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSingleEventAsync(Guid id)
        {
            return HandleResult(await this.mediator.Send(new GetById(id)));
        }

        // POST: /api/events
        /// <summary>
        /// Creates new event asynchronous.
        /// </summary>
        /// <param name="event">The event.</param>
        [HttpPost]
        public async Task<IActionResult> CreateEventAsync(Event @event)
        {
            return HandleResult(await this.mediator.Send(new Create(@event)));
        }

        // PUT: /api/events/{id}
        /// <summary>
        /// Edits event asynchronous.
        /// </summary>
        /// <param name="id">The id.</param>
        [Authorize(Policy = "IsEventHostOrModerator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEventAsync(Guid id, Event @event)
        {
            @event.Id = id;
            return HandleResult(await this.mediator.Send(new Edit(@event)));
        }

        // DELETE: /api/events/{id}
        /// <summary>
        /// Deletes event asynchronous.
        /// </summary>
        /// <param name="id">The id.</param>
        [Authorize(Policy = "IsEventHostOrModerator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventAsync(Guid id)
        {
            return HandleResult(await this.mediator.Send(new Delete(id)));
        }

        /// <summary>
        /// Attends the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await this.mediator.Send(new UpdateAttendance.Command { Id=id }));
        }
    }
}
