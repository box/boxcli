using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands
{
    public abstract class AbstractBoxSubCommandFactory : ISubCommandFactory
    {
        protected readonly IBoxHome _boxHome;
        protected readonly BoxEnvironments _environments;
        protected readonly BoxDefaultSettings _settings;
        protected readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        protected readonly LocalizedStringsResource _names;
        public AbstractBoxSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
            _boxPlatformBuilder = builder;
            _names = names;
        }

        public abstract ISubCommand CreateSubCommand(string commandName);
    }
}