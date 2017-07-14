using System;
using System.IO;
using BoxCLI.BoxPlatform.Cache;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace BoxCLI.BoxHome.BoxHomeFiles
{
    public class BoxPersistantCache
    {
        private readonly IBoxHome _boxHome;
        private readonly string _boxHomeCacheFileName;
        private readonly ILogger _logger;
        public BoxPersistantCache(string fileName, IBoxHome home, ILogger<BoxHomeDirectory> logger)
        {
            _boxHome = home;
            _logger = logger;
            _boxHomeCacheFileName = fileName;
        }

        public BoxCachedToken RetrieveTokenFromCache()
        {
            var path = GetBoxCacheFilePath();
            if (new FileInfo(path).Length == 0)
            {
                return new BoxCachedToken();
            }
            else
            {
                using (var fs = File.OpenText(path))
                {
                    var serializer = new JsonSerializer();
                    return (BoxCachedToken)serializer.Deserialize(fs, typeof(BoxCachedToken));
                }
            }
        }

        public void SetTokenInCache(BoxCachedToken token)
        {
            var path = GetBoxCacheFilePath();
            var serializer = new JsonSerializer();
            using (StreamWriter file = File.CreateText(path))
            {
                serializer.Serialize(file, token);
            }
        }

        public void BustCache()
        {
            RemoveBoxCacheFile();
            CreateBoxCacheFile();
        }

        public void RemoveBoxCacheFile()
        {
            var path = GetBoxCacheFilePath();
            File.Delete(path);
        }

        private string GetBoxCacheFilePath()
        {
            return CreateBoxCacheFile();
        }

        private string CreateBoxCacheFile()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeCacheFileName);
            if (!CheckIfBoxEnvironmentFileExists())
            {
                File.Create(path).Dispose();
                return path;
            }
            else
            {
                return path;
            }
        }

        private bool CheckIfBoxEnvironmentFileExists()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeCacheFileName);
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
    }
}