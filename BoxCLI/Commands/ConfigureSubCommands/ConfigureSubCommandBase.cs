using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.CommandUtilities;

namespace BoxCLI.Commands.ConfigureSubCommands
{
    public class ConfigureSubCommandBase : HelpCommandBase
    {
        protected IBoxHome _boxHome;
        protected BoxEnvironments _environments;
        protected BoxDefaultSettings _settings;

        public ConfigureSubCommandBase(IBoxHome boxHome)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
        }
    }
}