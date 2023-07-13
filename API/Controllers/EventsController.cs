﻿using Application.Events.Commands;
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
    [AllowAnonymous]
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
        public async Task<IActionResult> GetEventsAsync()
        {
            return HandleResult(await this.mediator.Send(new GetAll()));
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventAsync(Guid id)
        {
            return HandleResult(await this.mediator.Send(new Delete(id)));
        }
    }
}
