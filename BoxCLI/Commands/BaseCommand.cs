using System.IO;
using Box.V2;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;

namespace BoxCLI.Commands
{
    public abstract class BaseCommand
    {
        private readonly IBoxHome _boxHome;
        private readonly BoxDefaultSettings _settings;
        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        public BaseCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
            _boxHome = boxHome;
            _settings = boxHome.GetBoxHomeSettings();
        }
        protected virtual string ConstructReportPath(string fileName, string filePath = "", string fileFormat = "")
        {
            if (string.IsNullOrEmpty(filePath))
            {
                filePath = _settings.GetBoxReportsFolderPath();
            }
            if (!filePath.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                filePath = $"{filePath}{Path.DirectorySeparatorChar}";
            }
            if (string.IsNullOrEmpty(fileFormat))
            {
                fileFormat = _settings.GetBoxReportsFileFormatSetting();
            }
            return $"{filePath}{fileName}.{fileFormat}";
        }
        protected virtual string ConstructDownloadsPath(string fileName, string filePath = "")
        {
            if (string.IsNullOrEmpty(filePath))
            {
                filePath = _settings.GetBoxDownloadsFolderPath();
            }
            if (!filePath.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                filePath = $"{filePath}{Path.DirectorySeparatorChar}";
            }
            return $"{filePath}{fileName}";
        }

        protected BoxClient ConfigureBoxClient(string oneCallAsUserId = null)
        {
            var settings = _boxHome.GetBoxHomeSettings();
            var Box = _boxPlatformBuilder.Build();
            if (!string.IsNullOrEmpty(oneCallAsUserId))
            {
                return Box.AsUserClient(oneCallAsUserId);
            }
            else if (settings.GetBoxReportsUseDefaultAsUserSetting())
            {
                return Box.AsUserClient(settings.GetBoxReportsDefaultAsUserIdSetting());
            }
            else if (settings.GetBoxReportsUseTempAsUserSetting())
            {
                return Box.AsUserClient(settings.GetBoxReportsTempAsUserIdSetting());
            }
            else
            {
                return Box.AdminClient();
            }
        }
    }
}