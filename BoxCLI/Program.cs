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

namespace BoxCLI
{
    class Program
    {
        static public IConfigurationRoot Configuration { get; set; }
        static public IServiceProvider Services { get; set; }

        static int Main(string[] args)
        {
            // Task.Run(async () =>
            // {
                var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
                Configuration = builder.Build();

                IServiceCollection serviceCollection = new ServiceCollection();
                ConfigureServices(serviceCollection);
                Services = serviceCollection.BuildServiceProvider();
                Services.GetService<ILoggerFactory>()
                    .AddConsole(LogLevel.Debug);

                var app = new CommandLineApplication();
                var root = Services.GetService<RootCommand>();

                root.Configure(app);

                try
                {
                    return app.Execute(args);
                }
                catch (Exception ex)
                {
                    return 1;
                }
                // var Box = Services.GetRequiredService<IBoxPlatformService>();
                // var boxClient = Box.AdminClient();
                // var user = await boxClient.UsersManager.GetCurrentUserInformationAsync();
                // System.Console.WriteLine(user.Name);
            // }).GetAwaiter().GetResult();
        }

        static private void ConfigureServices(IServiceCollection serviceCollection)
        {
            serviceCollection
              .AddMemoryCache()
              .AddLogging()
              .AddTransient<IBoxHome, BoxHomeDirectory>()
              .AddTransient<IBoxPlatformCache, BoxPlatformCache>()
              .AddTransient<IBoxPlatformServiceBuilder, BoxPlatformServiceBuilder>()
              .AddSingleton<ConfigCommand>()
              .AddSingleton<UserCommand>()
              .AddSingleton<RootCommand>();
        }
    }
}
