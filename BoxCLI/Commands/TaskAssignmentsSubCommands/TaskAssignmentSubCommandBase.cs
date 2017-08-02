using System;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentSubCommandBase : BoxItemCommandBase
    {

        public TaskAssignmentSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
		}

		public override void Configure(Microsoft.Extensions.CommandLineUtils.CommandLineApplication command)
		{
			base.Configure(command);
		}

    }
}
