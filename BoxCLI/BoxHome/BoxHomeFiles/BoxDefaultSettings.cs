using System;
using System.IO;
using BoxCLI.BoxHome.Models;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace BoxCLI.BoxHome.BoxHomeFiles
{
    public class BoxDefaultSettings
    {
        private readonly IBoxHome _boxHome;
        private readonly string _boxHomeSettingsFileName;
        private readonly ILogger _logger;

        public readonly string FILE_FORMAT_CSV = "csv";
        public readonly string FILE_FORMAT_JSON = "json";

        public BoxDefaultSettings(string fileName, IBoxHome home, ILogger<BoxHomeDirectory> logger)
        {
            _boxHome = home;
            _boxHomeSettingsFileName = fileName;
            _logger = logger;
            var defaultSettings = new BoxHomeDefaultSettings();
            SetBoxReportsFolderPathIfNull(defaultSettings);
            SetBoxDownloadsFolderPathIfNull(defaultSettings);
            SerializeBoxHomeSettingsFile(defaultSettings);
        }

        public BoxHomeDefaultSettings GetAllSettings()
        {
            return DeserializeBoxHomeSettingsFile();

        }
        public bool GetBoxReportsUseDefaultAsUserSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.UseDefaultAsUser;
        }
        public string GetBoxReportsDefaultAsUserIdSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.DefaultAsUserId;
        }
        public bool GetBoxReportsUseTempAsUserSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.UseTempAsUser;
        }
        public string GetBoxReportsTempAsUserIdSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.TempAsUserId;
        }
        public string GetBoxReportsFolderPathSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.BoxReportsFolderPath;
        }
        public string GetBoxReportsFileFormatSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.BoxReportsFileFormat;
        }
        public string GetBoxDownloadsFolderPathSetting()
        {
            var settings = DeserializeBoxHomeSettingsFile();
            return settings.BoxDownloadsFolderPath;
        }

        public string GetBoxReportsFolderPath()
        {
            return CreateBoxReportsFolder();
        }

        public string GetBoxDownloadsFolderPath()
        {
            return CreateBoxDownloadsFolder();
        }

        public bool SetBoxReportsFolderPath(string path)
        {
            path = GeneralUtilities.TranslatePath(path);
            var currentSettings = DeserializeBoxHomeSettingsFile();
            currentSettings.BoxReportsFolderPath = path;
            try
            {
                SerializeBoxHomeSettingsFile(currentSettings);
                return true;
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
                return false;
            }
        }

        private string GetBoxHomeSettingsFilePath()
        {
            return CreateBoxHomeSettingsFile();
        }

        private void SerializeBoxHomeSettingsFile(BoxHomeDefaultSettings settings)
        {
            var path = GetBoxHomeSettingsFilePath();
            var serializer = new JsonSerializer();
            using (StreamWriter file = File.CreateText(path))
            {
                serializer.Serialize(file, settings);
            }
        }

        private BoxHomeDefaultSettings DeserializeBoxHomeSettingsFile()
        {
            var path = GetBoxHomeSettingsFilePath();
            using (var fs = File.OpenText(path))
            {
                var serializer = new JsonSerializer();
                return (BoxHomeDefaultSettings)serializer.Deserialize(fs, typeof(BoxHomeDefaultSettings));
            }
        }

        private string CreateBoxHomeSettingsFile()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeSettingsFileName);
            if (!CheckIfBoxHomeSettingsFileExists())
            {
                using (var fs = File.Create(path))
                {
                    return path;
                }
            }
            else
            {
                return path;
            }
        }

        private bool CheckIfBoxHomeSettingsFileExists()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeSettingsFileName);
            try
            {
                return File.Exists(path);
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
                return false;
            }
        }

        private bool CheckIfBoxReportsFolderExists()
        {
            var path = GetBoxReportsFolderPathSetting();
            try
            {
                return Directory.Exists(path);
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
                return false;
            }
        }
        private bool CheckIfBoxDownloadsFolderExists()
        {
            var path = GetBoxDownloadsFolderPathSetting();
            try
            {
                return Directory.Exists(path);
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
                return false;
            }
        }
        private string CreateBoxReportsFolder()
        {
            System.Console.WriteLine("Creating Box Reports folder...");
            var path = GetBoxReportsFolderPathSetting();
            System.Console.WriteLine($"Box Reports Folder Path: {path}");
            if (!CheckIfBoxReportsFolderExists())
            {
                System.Console.WriteLine("Box Reports folder doesn't exist...");
                var created = Directory.CreateDirectory(path);
                System.Console.WriteLine("created box reports folder...");
                return path;
            }
            else
            {
                System.Console.WriteLine("Found existing box reports folder...");
                return path;
            }
        }

        private string CreateBoxDownloadsFolder()
        {
            System.Console.WriteLine("Creating Box Downloads folder...");
            var path = GetBoxDownloadsFolderPathSetting();
            System.Console.WriteLine($"Box Downloads Folder Path: {path}");
            if (!CheckIfBoxDownloadsFolderExists())
            {
                Directory.CreateDirectory(path);
                System.Console.WriteLine("created box downloads folder...");
                return path;
            }
            else
            {
                return path;
            }
        }

        private BoxHomeDefaultSettings SetBoxDownloadsFolderPathIfNull(BoxHomeDefaultSettings settings)
        {
            if (string.IsNullOrEmpty(settings.BoxDownloadsFolderPath))
            {
                var path = $"{_boxHome.GetBaseDirectoryPath()}{Path.DirectorySeparatorChar}Downloads{Path.DirectorySeparatorChar}{settings.BoxDownloadsFolderName}";
                settings.BoxDownloadsFolderPath = path;
            }
            return settings;
        }
        private BoxHomeDefaultSettings SetBoxReportsFolderPathIfNull(BoxHomeDefaultSettings settings)
        {
            if (string.IsNullOrEmpty(settings.BoxReportsFolderPath))
            {
                var path = $"{_boxHome.GetBaseDirectoryPath()}{Path.DirectorySeparatorChar}Documents{Path.DirectorySeparatorChar}{settings.BoxReportsFolderName}";
                settings.BoxReportsFolderPath = path;
            }
            return settings;
        }
    }
}