using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly BoxType _t;
        public CollaborationSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names)
        {
            _t = t;
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected BoxType ProcessType(string type)
        {
            if (type.ToLower() == "file")
            {
                return BoxType.file;
            }
            else if (type.ToLower() == "folder")
            {
                return BoxType.folder;
            }
            else
            {
                throw new Exception("Not a valid Box item type to collaborate.");
            }
        }

        protected async Task ProcessCollaborationsFromFile(string id, string path, BoxType t, string asUser = "")
        {
            var boxClient = base.ConfigureBoxClient(asUser);
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            System.Console.WriteLine($"Path: {path}");
            try
            {
                System.Console.WriteLine("Reading file...");
                var collaborationRequests = base.ReadFile<BoxCollaborationRequest, BoxCollaborationRequestMap>(path);
                foreach (var collaborationRequest in collaborationRequests)
                {
                    System.Console.WriteLine($"Processing a collaboration request: {collaborationRequest.Item.Id}");
                    if (collaborationRequest.Item.Type != BoxType.file || collaborationRequest.Item.Type != BoxType.folder)
                    {
                        collaborationRequest.Item.Type = this._t;
                    }
                    var createdCollaboration = await boxClient.CollaborationsManager.AddCollaborationAsync(collaborationRequest);
                    this.PrintCollaboration(createdCollaboration);
                }
                System.Console.WriteLine("Created all collaborations...");
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        protected virtual void PrintCollaborations(BoxCollection<BoxCollaboration> collabs)
        {
            if (collabs == null || collabs.Entries.Count == 0)
            {
                Reporter.WriteInformation("This item has no collaborations.");
            }
            foreach (var collab in collabs.Entries)
            {
                base.PrintCollaboration(collab);
            }
        }
    }
}