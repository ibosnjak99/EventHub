using Domain;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /// <summary>
    /// The events controller class.
    /// </summary>
    /// <seealso cref="BaseApiController" />
    public class EventsController : BaseApiController
    {
        private readonly DataContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="EventsController" /> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public EventsController(DataContext context)
        {
            this.context = context;
        }

        // GET: /api/events 
        /// <summary>
        /// Gets the events asynchronous.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetEventsAsync()
        {
            return await this.context.Events.ToListAsync();
        }

        // GET: /api/events/{id}
        /// <summary>
        /// Gets the single event asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetSingleEventAsync(Guid id)
        {
            var singleEvent = await this.context.Events.FindAsync(id);

            if (singleEvent != null)
                return singleEvent;
            else
                return NotFound();
        }
    }
}
