using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles.Queries
{
    /// <summary>
    ///  The profile details class.
    /// </summary>
    public class Details : IRequest<Result<Profile>>
    {
        public string Username { get; set; } = string.Empty;
    }
}
