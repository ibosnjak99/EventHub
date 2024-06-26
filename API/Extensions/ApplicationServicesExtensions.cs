﻿using Application.Common;
using Application.Events;
using Application.Events.Queries;
using Application.Interfaces;
using Application.Users;
using Domain;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure;
using Infrastructure.Payment;
using Infrastructure.Payments;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Extensions
{
    /// <summary>
    /// Application services extensions class.
    /// </summary>
    public static class ApplicationServicesExtensions
    {
        /// <summary>
        /// Adds the application services.
        /// </summary>
        /// <param name="services">The services.</param>
        /// <param name="config">The configuration.</param>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate", "Pagination")
                        .WithOrigins("http://localhost:3000");
                });
            });

            StripeConfiguration.ApiKey = config["Stripe:SecretKey"];
            services.Configure<StripeSettings>(config.GetSection("Stripe"));

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddMediatR(typeof(GetAll));
            //services.RegisterDependencies();
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<EventsHandler>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUsersHandler, UsersHandler>();
            services.AddScoped<IStripeService, StripeService>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddSignalR();

            return services;
        }
    }
}
