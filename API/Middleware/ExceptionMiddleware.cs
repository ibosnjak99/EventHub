using Application.Core;
using System.Net;
using System.Text.Json;

namespace API.Middleware
{
    /// <summary>
    /// Exception middleware class.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;
        private readonly IHostEnvironment env;

        /// <summary>
        /// Initializes a new instance of the <see cref="ExceptionMiddleware" /> class.
        /// </summary>
        /// <param name="next">The next.</param>
        /// <param name="logger">The logger.</param>
        /// <param name="env">The env.</param>
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            this.next = next;
            this.logger = logger;
            this.env = env;
        }

        /// <summary>
        /// Invokes asynchronous.
        /// </summary>
        /// <param name="context">The context.</param>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await this.next(context);
            } 
            catch (Exception ex)
            {
                this.logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var stackTrace = ex.StackTrace?.ToString() ?? string.Empty;

                var response = this.env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, stackTrace)
                    : new AppException(context.Response.StatusCode, "Internal Server Error", stackTrace);

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
