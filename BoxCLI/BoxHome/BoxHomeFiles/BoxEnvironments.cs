using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Text.RegularExpressions;
using Box.V2.Config;
using BoxCLI.BoxHome.Models;
using BoxCLI.BoxHome.Models.BoxConfigFile;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Exceptions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            Reporter.WriteInformation($"Looking for file at this path {filePath}");
            if (File.Exists(filePath))
            {
                try
                {
                    Reporter.WriteInformation("Getting results of validation...");
                    var config = ValidateConfigFileValues(File.ReadAllText(filePath));
                    if (config.IsValid)
                    {
                        return true;
                    }
                    else
                    {
                        if (!config.HasClientId)
                        {
                            throw new Exception("Your configuration file is missing the client ID value.");
                        }
                        else if (!config.HasClientSecret)
                        {
                            throw new Exception("Your configuration file is missing the client secret value.");
                        }
                        else if (!config.HasEnterpriseId)
                        {
                            throw new Exception("Your configuration file is missing the Enterprise ID value.");
                        }
                        else if (!config.HasPublicKeyId)
                        {
                            throw new Exception("Your configuration file is missing the public key ID value.");
                        }
                        else
                        {
                            throw new Exception("An unknown error occurred.");
                        }
                    }
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        private BoxEnvironmentConfigFileValidation ValidateConfigFileValues(string jsonString)
        {

            var validation = new BoxEnvironmentConfigFileValidation();
            var config = BoxPlatformUtilities.ParseBoxConfig(jsonString);

            validation.HasClientId = (!string.IsNullOrEmpty(config.AppSettings.ClientId));
            validation.HasClientSecret = (!string.IsNullOrEmpty(config.AppSettings.ClientSecret));
            validation.HasPublicKeyId = (!string.IsNullOrEmpty(config.AppSettings.AppAuth.PublicKeyId));
            validation.HasEnterpriseId = (!string.IsNullOrEmpty(config.EnterpriseId));

            if (validation.HasClientId && validation.HasClientSecret && validation.HasEnterpriseId && validation.HasPublicKeyId)
            {
                validation.IsValid = true;
            }
            return validation;
        }
        public BoxHomeConfigModel RevalidateExistingConfigFile(string filePath, string privateKeyPath = "")
        {
            return TranslateConfigFileToEnvironment(filePath, privateKeyPath);
        }
        public BoxHomeConfigModel TranslateConfigFileToEnvironment(string filePath, string privateKeyPath = "")
        {
            filePath = GeneralUtilities.TranslatePath(filePath);
            var translatedConfig = new BoxHomeConfigModel();
            if (File.Exists(filePath))
            {
                var config = DeserializeBoxConfigFile(filePath);
                if (!string.IsNullOrEmpty(privateKeyPath))
                {
                    var potentialPathFromOptions = GeneralUtilities.TranslatePath(privateKeyPath);
                    if (File.Exists(potentialPathFromOptions))
                    {
                        translatedConfig.PrivateKeyPath = potentialPathFromOptions;
                    }
                    else
                    {
                        throw new Exception("Couldn't access the private key file from the path provided.");
                    }
                }
                else if (!string.IsNullOrEmpty(config.AppSettings.AppAuth.PrivateKey))
                {
                    Reporter.WriteInformation("Detected private key value in config...");
                    var pattern = @"^-----BEGIN ENCRYPTED PRIVATE KEY-----\n";
                    var regex = new Regex(pattern);
                    if (regex.IsMatch(config.AppSettings.AppAuth.PrivateKey))
                    {
                        Reporter.WriteInformation("Detected in-line private key.");
                        translatedConfig.HasInLinePrivateKey = true;
                    }
                    else
                    {
                        Reporter.WriteInformation("Attempting to resolve file path for private key.");
                        var potentialPath = GeneralUtilities.TranslateDependentPath(config.AppSettings.AppAuth.PrivateKey, filePath);
                        Reporter.WriteInformation($"Found {potentialPath}.");
                        if (File.Exists(potentialPath))
                        {
                            translatedConfig.PrivateKeyPath = potentialPath;
                        }
                    }
                }
                else
                {
                    throw new Exception("No in-line private key or private key file path provided.");
                }
                translatedConfig.ClientId = config.AppSettings.ClientId;
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
        public bool UpdatePrivateKeyPath(string existingName, string newPath)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            environments.Environments.TryGetValue(existingName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            foundEnv.PrivateKeyPath = GeneralUtilities.TranslatePath(newPath);
            environments.Environments[existingName] = foundEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
        }
        public bool UpdateConfigFilePath(string existingName, string newPath, string newPemPath = "")
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            environments.Environments.TryGetValue(existingName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            var translatePath = GeneralUtilities.TranslatePath(newPath);
            if (this.VerifyBoxConfigFile(translatePath))
            {
                BoxHomeConfigModel env;
                if (!string.IsNullOrEmpty(newPemPath))
                {
                    var translatePemPath = GeneralUtilities.TranslatePath(newPemPath);
                    env = this.TranslateConfigFileToEnvironment(translatePath, translatePemPath);
                }
                else
                {
                    env = this.TranslateConfigFileToEnvironment(translatePath);
                }
                foundEnv.BoxConfigFilePath = env.BoxConfigFilePath;
                foundEnv.ClientId = env.ClientId;
                foundEnv.EnterpriseId = env.EnterpriseId;
                foundEnv.HasInLinePrivateKey = env.HasInLinePrivateKey;
                foundEnv.PrivateKeyPath = env.PrivateKeyPath;
            }
            environments.Environments[existingName] = foundEnv;
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
            if (string.IsNullOrEmpty(environments.DefaultEnvironment))
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
        public bool DeleteEnvironment(string name)
        {
            var environmentFile = DeserializeBoxEnvironmentFile();
            BoxHomeConfigModel found;
            environmentFile.Environments.TryGetValue(name, out found);
            if (found != null)
            {
                environmentFile.Environments.Remove(name);
                if (environmentFile.DefaultEnvironment == name)
                {
                    environmentFile.DefaultEnvironment = "";
                }
                SerializeBoxEnvironmentFile(environmentFile);
                return true;
            }
            else
            {
                throw new Exception("Couldn't find this environment.");
            }
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
        public bool UpdateEnvironment(BoxHomeConfigModel newEnv, string envName)
        {
            var environments = DeserializeBoxEnvironmentFile();
            var foundEnv = new BoxHomeConfigModel();
            environments.Environments.TryGetValue(envName, out foundEnv);
            if (foundEnv == null || string.IsNullOrEmpty(foundEnv.Name))
            {
                throw new Exception("Couldn't find that environment");
            }
            environments.Environments[envName] = newEnv;
            this.SerializeBoxEnvironmentFile(environments);
            return true;
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