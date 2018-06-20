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
using Newtonsoft.Json.Linq;
using Box.V2.Exceptions;

namespace BoxCLI
{
    class Program
    {
        static public IConfigurationRoot Configuration { get; set; }
        static public IServiceProvider Services { get; set; }

        static private CommandLineApplication _app;

        static int Main(string[] args)
        {
            var builder = new ConfigurationBuilder();
            Configuration = builder.Build();

            IServiceCollection serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            Services = serviceCollection.BuildServiceProvider();

            try
            {
                var app = new CommandLineApplication();
                var root = Services.GetService<RootCommand>();
                _app = app;

                root.Configure(app);
                return app.Execute(args);
            }
            catch (AggregateException aggEx)
            {
                if (aggEx.InnerException.GetType() == typeof(BoxSessionInvalidatedException))
                {
                    Reporter.WriteError("Token not valid.");
                    Reporter.WriteError("Please try another token with the --token option.");
                }
                else if (aggEx != null && !string.IsNullOrEmpty(aggEx.Message))
                {
                    Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(aggEx.InnerException));
                }
                if (aggEx.InnerException != null)
                {
                    if (aggEx.InnerException.GetType() == typeof(NoEnvironmentsFoundException))
                    {
                        Reporter.WriteError("It looks like you haven't configured the Box CLI yet.");
                        Reporter.WriteError("Use this command to start using the CLI: box configure environments add");
                        Reporter.WriteError("Or, supply a token with your command with --token.");
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                if (ex != null && !string.IsNullOrEmpty(ex.Message))
                {
                    Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(ex));
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
              .AddSingleton<IBoxHome, BoxHomeDirectory>()
              .AddSingleton<IBoxPlatformCache, BoxPlatformCache>()
              .AddSingleton<IBoxCollectionsIterators, BoxCollectionsIterators>()
              .AddSingleton<IBoxPlatformServiceBuilder, BoxPlatformServiceBuilder>()
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
              .AddSingleton<CommentCommand>()
              .AddSingleton<StoragePolicyCommand>()
              .AddSingleton<RootCommand>();
        }
    }
}
