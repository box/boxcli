using System;
using System.Collections.Generic;
using System.IO;
using BoxCLI.BoxHome.Models;
using BoxCLI.BoxHome.BoxHomeFiles;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoxCLI.BoxHome
{
    public class BoxHomeDirectory : IBoxHome
    {
        public readonly string BoxHomeDirectoryName;
        public readonly string BoxHomeEnvironmentVariable;

        public readonly string BoxHomeSettingsFileName;

        public readonly BoxEnvironments BoxEnvironments;
        public readonly BoxPersistantCache BoxPersistantCache;

        private readonly ILogger _logger;
        public BoxHomeDirectory(IOptions<BoxHomeSettings> settings, ILogger<BoxHomeDirectory> logger)
        {
            _logger = logger;
            BoxHomeDirectoryName = settings.Value.BoxHomeDirectoryName;
            BoxHomeEnvironmentVariable = settings.Value.BoxHomeEnvironmentVariable;
            CreateBoxHomeDirectory();

            BoxEnvironments = new BoxEnvironments(settings.Value.BoxHomeEnvironmentsFileName, this, logger);
            BoxPersistantCache = new BoxPersistantCache(settings.Value.BoxHomeCacheFileName, this, logger);

        }
        public string GetBoxHomeDirectoryPath()
        {
            return CreateBoxHomeDirectory();
        }
        public void RemoveBoxHomeDirectory()
        {
            var boxDir = GetBoxHomeDirectoryPath();
            Directory.Delete(boxDir, true);
        }

        public BoxEnvironments GetBoxEnvironments()
        {
            return BoxEnvironments;
        }
        public BoxPersistantCache GetBoxCache()
        {
            return BoxPersistantCache;
        }

        private string GetBaseDirectoryPath()
        {
            var home = Environment.GetEnvironmentVariable(BoxHomeEnvironmentVariable);
            if (string.IsNullOrEmpty(home))
            {
                home = Environment.GetEnvironmentVariable("HOME");
                if (string.IsNullOrEmpty(home))
                {
                    home = Environment.GetEnvironmentVariable("USERPROFILE");
                    if (string.IsNullOrEmpty(home))
                    {
                        throw new Exception($"Cannot locate the {BoxHomeDirectoryName} directory.");
                    }
                }
            }
            return home;
        }


        private string CreateBoxHomeDirectory()
        {
            var baseDirectoryPath = GetBaseDirectoryPath();
            if (!CheckIfBoxHomeDirectoryExists())
            {
                var path = Path.Combine(baseDirectoryPath, BoxHomeDirectoryName);
                var newDir = Directory.CreateDirectory(path);
                return path;
            }
            else
            {
                var home = GetBaseDirectoryPath();
                home = Path.Combine(home, BoxHomeDirectoryName);
                return home;
            }
        }

        private bool CheckIfBoxHomeDirectoryExists()
        {
            var baseDirectoryPath = GetBaseDirectoryPath();
            var path = Path.Combine(baseDirectoryPath, BoxHomeDirectoryName);
            try
            {
                return Directory.Exists(path);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return false;
            }
        }
    }
}