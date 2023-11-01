using Application.Core;
using MediatR;

namespace Application.Profiles.Queries
{
    /// <summary>
    /// The get all class.
    /// </summary>
    public class GetAll : IRequest<Result<List<Profile>>>
    {
    }
}
