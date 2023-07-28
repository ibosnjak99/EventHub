using Application.Events;
using AutoMapper;
using Domain;
using Domain.Models;

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
            CreateMap<Event, EventDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<EventAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}
