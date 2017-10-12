using System;
using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSubCommandBase : ConfigureSubCommandBase
    {
        public ConfigureEnvironmentsSubCommandBase(IBoxHome boxHome) : base(boxHome)
        {
        }

        protected virtual void GetCurrent()
        {
            var defaultEnv = _environments.GetDefaultEnvironment();
            Reporter.WriteInformation("Current default environment:");
            Reporter.WriteInformation($"Name: {defaultEnv.Name}");
            Reporter.WriteInformation($"Client ID: {defaultEnv.ClientId}");
            Reporter.WriteInformation($"Enterprise ID: {defaultEnv.EnterpriseId}");
        }
    }
}