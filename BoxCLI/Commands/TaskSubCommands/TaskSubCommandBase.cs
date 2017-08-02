using System;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskSubCommandBase : BoxItemCommandBase
    {
        public TaskSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

		public override void Configure(CommandLineApplication command)
		{
			_asUser = AsUserOption.ConfigureOption(command);
			_json = OutputJsonOption.ConfigureOption(command);
			base.Configure(command);
		}

        protected virtual void PrintTask(BoxTask task)
        {
            Reporter.WriteInformation($"Task ID: {task.Id}");
            Reporter.WriteInformation($"Task Action: {task.Action}");
            Reporter.WriteInformation($"Task Message: {task.Message}");
        }
    }
}
