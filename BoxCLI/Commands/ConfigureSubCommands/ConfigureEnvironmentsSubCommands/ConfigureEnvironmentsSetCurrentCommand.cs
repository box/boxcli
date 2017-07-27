using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSetCurrentCommand : BoxBaseCommand
    {
        private CommandArgument _name;
        private CommandLineApplication _app;

        public ConfigureEnvironmentsSetCurrentCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set your current Box environment to use.";
            _name = command.Argument("name",
                               "Name of the environment");
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunSetCurrent();
            return await base.Execute();
        }

        private async Task RunSetCurrent()
        {
            base.CheckForValue(this._name.Value, this._app, "An environment name is required for this command.");
            base._environments.SetDefaultEnvironment(this._name.Value);
            Reporter.WriteSuccess("Successfully set new default environment:");
            await base._boxPlatformBuilder.Build().BustCache();
            this.GetCurrent();
        }
        protected virtual void GetCurrent()
        {
            var defaultEnv = _environments.GetDefaultEnvironment();
            System.Console.WriteLine("Current default environment:");
            System.Console.WriteLine($"Name: {defaultEnv.Name}");
            System.Console.WriteLine($"Client ID: {defaultEnv.ClientId}");
            System.Console.WriteLine($"Enterprise ID: {defaultEnv.EnterpriseId}");
        }
    }
}