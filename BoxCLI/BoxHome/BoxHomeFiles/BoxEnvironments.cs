using System;
using System.Collections.Generic;
using System.IO;
using Box.V2.Config;
using BoxCLI.BoxHome.Models;
using BoxCLI.BoxHome.Models.BoxConfigFile;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Exceptions;
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
        public bool GetUseTempAsUserSetting()
        {
            var env = GetDefaultEnvironment();
            return env.UseTempAsUser;
        }
        public bool GetUseDefaultAsUserSetting()
        {
            var env = GetDefaultEnvironment();
            return env.UseDefaultAsUser;
        }
        public string GetTempAsUserIdSetting()
        {
            var env = GetDefaultEnvironment();
            return env.TempAsUserId;
        }
        public string GetDefaultAsUserIdSetting()
        {
            var env = GetDefaultEnvironment();
            return env.DefaultAsUserId;
        }
        public string GetAdminAsUserIdSetting()
        {
            var env = GetDefaultEnvironment();
            return env.AdminAsUserId;
        }
        public DateTime? GetUserSessionExpirationSetting()
        {
            var env = GetDefaultEnvironment();
            return env.UserSessionExpiration;
        }
        public bool GetUserSessionEnabledSetting()
        {
            var env = GetDefaultEnvironment();
            return env.UserSessionEnabled;
        }
        public void ExpireUserSession()
        {
            this.RemoveTempAsUserIdSetting();
            this.RemoveUserSessionExpirationSetting();
            this.ToggleUseDefaultUserSetting(turnOff: true);
            this.ToggleUseTempUserSetting(turnOff: true);
            this.ToggleUserSessionEnabledSetting(turnOff: true);
        }
        public bool ToggleUseDefaultUserSetting(bool turnOn = false, bool turnOff = false)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            if (turnOff)
            {
                foundEnv.UseDefaultAsUser = false;
            }
            else if (turnOn)
            {
                foundEnv.UseDefaultAsUser = true;
            }
            else
            {
                foundEnv.UseDefaultAsUser = !foundEnv.UseDefaultAsUser;
            }
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return foundEnv.UseDefaultAsUser;
        }
        public bool ToggleUseTempUserSetting(bool turnOn = false, bool turnOff = false)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Can't find the current environment");
            }
            if (turnOff)
            {
                foundEnv.UseTempAsUser = false;
            }
            else if (turnOn)
            {
                foundEnv.UseTempAsUser = true;
            }
            else
            {
                foundEnv.UseTempAsUser = !foundEnv.UseTempAsUser;
            }
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return foundEnv.UseTempAsUser;
        }
        public bool ToggleUserSessionEnabledSetting(bool turnOn = false, bool turnOff = false)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Can't find the current environment");
            }
            if (turnOff)
            {
                foundEnv.UserSessionEnabled = false;
            }
            else if (turnOn)
            {
                foundEnv.UserSessionEnabled = true;
            }
            else
            {
                foundEnv.UserSessionEnabled = !foundEnv.UserSessionEnabled;
            }
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return foundEnv.UserSessionEnabled;
        }
        public bool ChangeBoxEnvironmentName(string existingName, string newName)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            environments.Environments.TryGetValue(existingName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            environments.Environments.Remove(existingName);

            if (environments.DefaultEnvironment == existingName)
            {
                environments.DefaultEnvironment = newName;
            }
            environments.Environments[newName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool SetTempAsUserIdSetting(string userId)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Can't find the current environment");
            }
            foundEnv.TempAsUserId = userId;
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool RemoveUserSessionExpirationSetting()
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Can't find the current environment");
            }
            foundEnv.UserSessionExpiration = null;
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool RemoveTempAsUserIdSetting()
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Can't find the current environment");
            }
            foundEnv.TempAsUserId = "";
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool SetDefaultAsUserIdSetting(string userId, string envName = "")
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            if (string.IsNullOrEmpty(envName))
            {
                envName = environments.DefaultEnvironment;
            }
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            foundEnv.DefaultAsUserId = userId;
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool SetAdminAsUserIdSetting(string adminUserId, string envName = "")
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            if (string.IsNullOrEmpty(envName))
            {
                envName = environments.DefaultEnvironment;
            }
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            foundEnv.AdminAsUserId = adminUserId;
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool SetUserSessionExpirationSetting(DateTime expires)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            var envName = environments.DefaultEnvironment;
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            foundEnv.UserSessionExpiration = expires;
            environments.Environments[envName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
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
            if(string.IsNullOrEmpty(environments.DefaultEnvironment))
                throw new NoEnvironmentsFoundException("No default environment found.");
            BoxHomeConfigModel defaultEnv;
            environments.Environments.TryGetValue(environments.DefaultEnvironment, out defaultEnv);
            return defaultEnv;
        }

        public Dictionary<string, BoxHomeConfigModel> GetAllEnvironments()
        {
            var environments = DeserializeBoxEnvironmentFile();
            return environments.Environments;
        }

        public bool UpdateEnvironmentFilePath(string path, string envName)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            if (this.VerifyBoxConfigFile(path))
            {
                var newEnv = this.TranslateConfigFileToEnvironment(path);
                newEnv.AdminAsUserId = (string.IsNullOrEmpty(foundEnv.AdminAsUserId)) ? "" : foundEnv.AdminAsUserId;
                newEnv.DefaultAsUserId = (string.IsNullOrEmpty(foundEnv.DefaultAsUserId)) ? "" : foundEnv.DefaultAsUserId;
                newEnv.UseDefaultAsUser = foundEnv.UseDefaultAsUser;
                environments.Environments[envName] = newEnv;
                this.SerializeBoxEnvironmentFile(environments);
                return true;
            }
            else
            {
                throw new Exception("Not a valid config file.");
            }

        }

        private string GetBoxEnvironmentFilePath()
        {
            return CreateOrReturnBoxEnvironmentFile();
        }

        private string CreateOrReturnBoxEnvironmentFile()
        {
            var boxHome = _boxHome.GetBoxHomeDirectoryPath();
            var path = Path.Combine(boxHome, _boxHomeEnvironmentsFileName);
            if (!File.Exists(path))
            {
                File.Create(path).Dispose();
                var emptyEnv = new EnvironmentsModel();
                SerializeBoxEnvironmentFile(emptyEnv);
                return path;
            }
            else
            {
                return path;
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
    }
}