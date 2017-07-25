using System;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.FileSubCommand;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionSubCommandBase : FileSubCommandBase
    {
        public FileVersionSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        protected void CheckForFileVersionId(string id, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(id))
            {
                app.ShowHelp();
                throw new Exception("A file version ID is required for this command.");
            }
        }

        protected void PrintFileVersion(BoxFileVersion v)
        {
            Reporter.WriteInformation($"File Version ID: {v.Id}");
            Reporter.WriteInformation($"File Version Name: {v.Name}");
            Reporter.WriteInformation($"File Version Size: {v.Size}");
            Reporter.WriteInformation($"Created at: {v.CreatedAt}");
            Reporter.WriteInformation($"Modified at: {v.ModifiedAt}");
            Reporter.WriteInformation("Modified By:");
            base.PrintMiniUser(v.ModifiedBy);
        }
    }
}