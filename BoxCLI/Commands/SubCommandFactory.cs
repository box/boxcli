using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.CollaborationSubCommands;
using BoxCLI.Commands.CommentSubCommands;
using BoxCLI.Commands.ConfigureSubCommands;
using BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands;
using BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands;
using BoxCLI.Commands.EventSubCommands;
using BoxCLI.Commands.FileSubCommand;
using BoxCLI.Commands.FileVersionSubCommands;
using BoxCLI.Commands.FolderSubCommands;
using BoxCLI.Commands.GroupSubCommands;
using BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands;
using BoxCLI.Commands.MetadataSubCommands;
using BoxCLI.Commands.MetadataTemplateSubCommands;
using BoxCLI.Commands.SessionSubCommands;
using BoxCLI.Commands.SharedLinkSubCommands;
using BoxCLI.Commands.TaskAssignmentsSubCommands;
using BoxCLI.Commands.TaskSubCommands;
using BoxCLI.Commands.TokenSubCommands;
using BoxCLI.Commands.TrashSubCommands;
using BoxCLI.Commands.UserSubCommands;
using BoxCLI.Commands.WebhooksSubComands;
using BoxCLI.Commands.StoragePolicySubCommands;
using BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands
{
    public class SubCommandFactory
    {
        private readonly IBoxHome _boxHome;
        private readonly BoxEnvironments _environments;
        private readonly BoxDefaultSettings _settings;
        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        private readonly LocalizedStringsResource _names;

        public SubCommandFactory(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
            _boxPlatformBuilder = boxPlatformBuilder;
            _names = names;
        }

        public ISubCommandFactory CreateFactory(string factoryName)
        {
            if (factoryName == _names.CommandNames.Settings)
            {
                return new ConfigureSettingsSubCommandFactory(_boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Environments)
            {
                return new ConfigureEnvironmentsSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Folders)
            {
                return new FolderSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Trash)
            {
                return new TrashSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Files)
            {
                return new FileSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FileVersions)
            {
                return new FileVersionSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Users)
            {
                return new UserSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Webhooks)
            {
                return new WebhooksSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Groups)
            {
                return new GroupSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.GroupMembership)
            {
                return new GroupMembershipSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FileMetadata)
            {
                return new FilesMetadataSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FolderMetadata)
            {
                return new FoldersMetadataSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FileSharedLinks)
            {
                return new FilesSharedLinkSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FolderSharedLinks)
            {
                return new FoldersSharedLinkSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Collaborations)
            {
                return new CollaborationSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FileCollaborations)
            {
                return new FilesCollaborationSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FolderCollaborations)
            {
                return new FoldersCollaborationSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.MetadataTemplates)
            {
                return new MetadataTemplateSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Events)
            {
                return new EventSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.SharedLinks)
            {
                return new SharedLinkSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Session)
            {
                return new SessionSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Token)
            {
                return new TokenSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Task)
            {
                return new TaskSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.FileTask)
            {
                return new FileTaskSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.TaskAssignment)
            {
                return new TaskAssignmentSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.Comment)
            {
                return new CommentSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.StoragePolicy)
            {
                return new StoragePolicySubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (factoryName == _names.CommandNames.StoragePolicyAssignment)
            {
                return new StoragePolicyAssignmentSubCommandFactory(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}