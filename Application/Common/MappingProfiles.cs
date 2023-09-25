using Application.Comments;
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
            string currentUsername = null;

            CreateMap<Event, Event>();

            CreateMap<Event, EventDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<EventAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsProfile).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername))); ;

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, s => s.MapFrom(o => o.Photos.FirstOrDefault(x => x.IsProfile).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsProfile).Url));

            CreateMap<EventAttendee, Profiles.UserEventDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.@event.Id))
            .ForMember(d => d.Date, o => o.MapFrom(s => s.@event.Date))
            .ForMember(d => d.Title, o => o.MapFrom(s => s.@event.Title))
            .ForMember(d => d.Category, o => o.MapFrom(s =>
                s.@event.Category))
            .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                s.@event.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
        }
    }
}
