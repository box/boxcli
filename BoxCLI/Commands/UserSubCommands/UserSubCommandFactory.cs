using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public UserSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new UserGetCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.List)
            {
                return new UserListCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Search)
            {
                return new UserSearchCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new UserCreateCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new UserUpdateCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new UserDeleteCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Invite)
            {
                return new UserInviteCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.MoveRootContent)
            {
                return new UserMoveRootContentCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.ChangeLogin)
            {
                return new UserChangeLoginCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.AddEmailAlias)
            {
                return new UserAddEmailAliasCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.GetEmailAliases)
            {
                return new UserGetEmailAliasesCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.DeleteEmailAlias)
            {
                return new UserDeleteEmailAliasCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}