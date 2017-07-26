using System;
using BoxCLI.BoxHome;
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
            System.Console.WriteLine("Current default environment:");
            System.Console.WriteLine($"Name: {defaultEnv.Name}");
            System.Console.WriteLine($"Client ID: {defaultEnv.ClientId}");
            System.Console.WriteLine($"Enterprise ID: {defaultEnv.EnterpriseId}");
        }
    }
}