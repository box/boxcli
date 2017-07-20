using System;
using System.Collections.Generic;
using System.IO;
using Box.V2.Config;
using BoxCLI.BoxHome.Models;
using BoxCLI.BoxHome.Models.BoxConfigFile;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BoxCLI.BoxHome.BoxHomeFiles
{
    public class BoxEnvironments
    {
        private readonly IBoxHome _boxHome;
        private readonly string _boxHomeEnvironmentsFileName;
        public BoxEnvironments(string fileName, IBoxHome home)
        {
            _boxHome = home;
            _boxHomeEnvironmentsFileName = fileName;
        }

        public bool VerifyBoxConfigFile(string filePath)
        {
            filePath = GeneralUtilities.TranslatePath(filePath);
            if (File.Exists(filePath))
            {
                using (FileStream fs = new FileStream(filePath, FileMode.Open))
                {
                    try
                    {
                        var config = BoxConfig.CreateFromJsonFile(fs);
                        return true;
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError(e.Message);
                        return false;
                    }
                }
            }
            else
            {
                return false;
            }
        }

        public BoxHomeConfigModel TranslateConfigFileToEnvironment(string filePath)
        {
            filePath = GeneralUtilities.TranslatePath(filePath);
            var translatedConfig = new BoxHomeConfigModel();
            if (File.Exists(filePath))
            {
                var config = DeserializeBoxConfigFile(filePath);
                translatedConfig.ClientId = config.appSettings.ClientId;
                translatedConfig.EnterpriseId = config.EnterpriseId;
                translatedConfig.BoxConfigFilePath = filePath;
            }
            else
            {
                Reporter.WriteError("Couldn't open file...");
            }
            return translatedConfig;
        }
        private string GetBoxEnvironmentFilePath()
        {
            return CreateBoxEnvironmentFile();
        }

        private string CreateBoxEnvironmentFile()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeEnvironmentsFileName);
            if (!CheckIfBoxEnvironmentFileExists())
            {
                using (var fs = File.Create(path))
                {
                    var emptyEnv = new EnvironmentsModel();
                    SerializeBoxEnvironmentFile(emptyEnv);
                    return path;
                }
            }
            else
            {
                return path;
            }
        }

        public bool AddNewEnvironment(BoxHomeConfigModel env, bool isDefault = false)
        {
            var update = DeserializeBoxEnvironmentFile();
            if (isDefault || string.IsNullOrEmpty(update.DefaultEnvironment))
            {
                update.DefaultEnvironment = env.Name;
            }
            if (!CheckForDistinctEnvironments(update.Environments, env.Name))
            {
                update.Environments.Add(env.Name, env);
                SerializeBoxEnvironmentFile(update);
                return true;
            }
            else
            {
                Reporter.WriteWarning("This environment already exists.");
                return false;
            }
        }

        private bool CheckForDistinctEnvironments(Dictionary<string, BoxHomeConfigModel> environments, string name)
        {
            var isExisting = false;
            try
            {
                isExisting = environments.ContainsKey(name);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
            return isExisting;
        }

        public void SetDefaultEnvironment(string name)
        {
            var environmentFile = DeserializeBoxEnvironmentFile();
            BoxHomeConfigModel found;
            environmentFile.Environments.TryGetValue(name, out found);
            if (found != null)
            {
                environmentFile.DefaultEnvironment = found.Name;
                SerializeBoxEnvironmentFile(environmentFile);
            }
            else
            {
                throw new Exception("Couldn't find this environment.");
            }
        }

        public BoxHomeConfigModel GetDefaultEnvironment()
        {
            var environments = DeserializeBoxEnvironmentFile();
            BoxHomeConfigModel defaultEnv;
            environments.Environments.TryGetValue(environments.DefaultEnvironment, out defaultEnv);
            return defaultEnv;

        }

        public Dictionary<string, BoxHomeConfigModel> GetAllEnvironments()
        {
            var environments = DeserializeBoxEnvironmentFile();
            return environments.Environments;
        }

        private void SerializeBoxEnvironmentFile(EnvironmentsModel environments)
        {
            var path = GetBoxEnvironmentFilePath();
            var serializer = new JsonSerializer();
            using (StreamWriter file = File.CreateText(path))
            {
                serializer.Serialize(file, environments);
            }
        }

        private EnvironmentsModel DeserializeBoxEnvironmentFile()
        {
            var path = GetBoxEnvironmentFilePath();
            using (var fs = File.OpenText(path))
            {
                var serializer = new JsonSerializer();
                return (EnvironmentsModel)serializer.Deserialize(fs, typeof(EnvironmentsModel));
            }
        }

        private BoxConfigFileModel DeserializeBoxConfigFile(string path)
        {
            using (var fs = File.OpenText(path))
            {
                var serializer = new JsonSerializer();
                return (BoxConfigFileModel)serializer.Deserialize(fs, typeof(BoxConfigFileModel));
            }
        }

        private bool CheckIfBoxEnvironmentFileExists()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeEnvironmentsFileName);
            try
            {
                return File.Exists(path);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
                return false;
            }
        }
    }
}