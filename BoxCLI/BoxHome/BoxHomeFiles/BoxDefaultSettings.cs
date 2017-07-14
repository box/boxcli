using Microsoft.Extensions.Logging;

namespace BoxCLI.BoxHome.BoxHomeFiles
{
    public class BoxDefaultSettings
    {
        private readonly IBoxHome _boxHome;
        private readonly string _boxHomeSettingsFileName;
        private readonly ILogger _logger;

        public BoxDefaultSettings(string fileName, IBoxHome home, ILogger<BoxHomeDirectory> logger) 
        {
            _boxHome = home;
            _boxHomeSettingsFileName = fileName;
            _logger = logger;
        }
    }
}