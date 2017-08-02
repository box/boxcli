using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using BoxCLI.BoxPlatform;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Service;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.CommandLineUtils;
using BoxCLI.Commands;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities.Globalization;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization.Models;
using BoxCLI.Commands.ConfigureSubCommands;
using BoxCLI.CommandUtilities.Exceptions;

namespace BoxCLI
{
    class Program
    {
        static public IConfigurationRoot Configuration { get; set; }
        static public IServiceProvider Services { get; set; }

        static int Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            Configuration = builder.Build();

            IServiceCollection serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            Services = serviceCollection.BuildServiceProvider();


            try
            {
                var app = new CommandLineApplication();
                var root = Services.GetService<RootCommand>();

                root.Configure(app);
                return app.Execute(args);
            }
            catch (Exception ex)
            {
                if (!string.IsNullOrEmpty(ex.Message))
                {
                    Reporter.WriteError(ex.Message);
                }
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.GetType() == typeof(NoEnvironmentsFoundException))
                    {
                        Reporter.WriteError("It looks like you haven't configured the Box CLI yet.");
                        Reporter.WriteError("Use this command to start using the CLI: box configure environments add");
                    }
                }
                return 1;
            }
        }

        static private void ConfigureServices(IServiceCollection serviceCollection)
        {
            serviceCollection
              .AddMemoryCache()
              .Configure<LocalizedStrings>(Configuration.GetSection("LocalizedStrings"))
              .AddTransient<IBoxHome, BoxHomeDirectory>()
              .AddTransient<IBoxPlatformCache, BoxPlatformCache>()
              .AddTransient<IBoxCollectionsIterators, BoxCollectionsIterators>()
              .AddTransient<IBoxPlatformServiceBuilder, BoxPlatformServiceBuilder>()
              .AddSingleton<LocalizedStringsResource>()
              .AddSingleton<SubCommandFactory>()
              .AddSingleton<ConfigureCommand>()
              .AddSingleton<UserCommand>()
              .AddSingleton<FolderCommand>()
              .AddSingleton<FileCommand>()
              .AddSingleton<WebhooksCommand>()
              .AddSingleton<GroupCommand>()
              .AddSingleton<MetadataTemplateCommand>()
              .AddSingleton<EventCommand>()
              .AddSingleton<CollaborationCommand>()
              .AddSingleton<SharedLinkCommand>()
              .AddSingleton<TrashCommand>()
              .AddSingleton<SessionCommand>()
              .AddSingleton<TokenCommand>()
              .AddSingleton<SearchCommand>()
              .AddSingleton<TaskCommand>()
              .AddSingleton<TaskAssignmentCommand>()
              .AddSingleton<RootCommand>();
        }
    }
}
