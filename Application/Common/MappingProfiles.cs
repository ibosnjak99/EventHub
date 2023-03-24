using AutoMapper;
using Domain;

namespace Application.Common
{
    /// <summary>
    /// Mapping profiles class.
    /// </summary>
    /// <seealso cref="Profile" />
    public class MappingProfiles : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MappingProfiles" /> class.
        /// </summary>
        public MappingProfiles()
        {
            CreateMap<Event, Event>();
        }
    }
}
