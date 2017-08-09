using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsListCommand : ConfigureEnvironmentsSubCommandBase
    {
        public ConfigureEnvironmentsListCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "List all Box environments.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunList();
            return base.Execute();
        }

        private void RunList()
        {
            var environments = base._environments.GetAllEnvironments();
            foreach (var environment in environments)
            {
                var inline = (environment.Value.HasInLinePrivateKey) ? "Yes" : "No";
                Reporter.WriteInformation("*******************************");
                Reporter.WriteInformation($"Name: {environment.Value.Name}");
                Reporter.WriteInformation($"Client ID: {environment.Value.ClientId}");
                Reporter.WriteInformation($"Enterprise ID: {environment.Value.EnterpriseId}");
                Reporter.WriteInformation($"Path to Config File: {environment.Value.BoxConfigFilePath}");
                Reporter.WriteInformation($"Path to Private Key File: {environment.Value.PrivateKeyPath}");
                Reporter.WriteInformation($"Has in-line Private Key?: {inline}");
                Reporter.WriteInformation("*******************************");
            }
        }
    }
}