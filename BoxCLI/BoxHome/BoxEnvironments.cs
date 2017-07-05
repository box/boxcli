using System;
using System.Collections.Generic;
using System.IO;
using Box.V2.Config;
using BoxCLI.BoxHome.Models;
using BoxCLI.BoxHome.Models.BoxConfigFile;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BoxCLI.BoxHome
{
    public class BoxEnvironments
    {
        private readonly IBoxHome _boxHome;
        public readonly string BoxHomeEnvironmentsFileName;
        public BoxEnvironments(string fileName, IBoxHome home)
        {
            _boxHome = home;
            BoxHomeEnvironmentsFileName = fileName;
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
                        System.Console.WriteLine(e.Message);
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
            System.Console.WriteLine("Translated filePath");
            System.Console.WriteLine(filePath);
            var translatedConfig = new BoxHomeConfigModel();
            if (File.Exists(filePath))
            {
                System.Console.WriteLine("File exists...");
                var config = DeserializeBoxConfigFile(filePath);
                System.Console.WriteLine("Deserialized config...");
                System.Console.WriteLine(config.EnterpriseId);
                translatedConfig.ClientId = config.appSettings.ClientId;
                translatedConfig.ClientSecret = config.appSettings.ClientSecret;
                translatedConfig.EnterpriseId = config.EnterpriseId;
                translatedConfig.JwtPrivateKey = config.appSettings.AppAuth.PrivateKey;
                translatedConfig.JwtPrivateKeyPassword = config.appSettings.AppAuth.Passphrase;
                translatedConfig.JwtPublicKeyId = config.appSettings.AppAuth.PublicKeyId;
            }
            else
            {
                System.Console.WriteLine("Couldn't open file...");
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
            var path = Path.Combine(boxHome, BoxHomeEnvironmentsFileName);
            if (!CheckIfBoxEnvironmentFileExists())
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

        public void AddNewEnvironment(BoxHomeConfigModel env, bool isDefault = false)
        {
            System.Console.WriteLine("Loading environment file into memory...");
            var update = DeserializeBoxEnvironmentFile();
            if (isDefault || string.IsNullOrEmpty(update.DefaultEnvironment))
            {
                update.DefaultEnvironment = env.Name;
            }
            System.Console.WriteLine("Checking for existing config...");
            if (!CheckForDistinctEnvironments(update.Environments, env.Name))
            {
                System.Console.WriteLine("Config not found, adding...");
                update.Environments.Add(env.Name, env);
            }
            else
            {
                System.Console.WriteLine("This environment already exists.");
            }
            System.Console.WriteLine("Serializing and saving environments file...");
            SerializeBoxEnvironmentFile(update);
        }

        private bool CheckForDistinctEnvironments(Dictionary<string, BoxHomeConfigModel> environments, string name)
        {
            System.Console.WriteLine("Checking if distinct config...");
            System.Console.WriteLine(name);
            var isExisting = false;
            try
            {
                isExisting = environments.ContainsKey(name);
            }
            catch(Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
            System.Console.WriteLine(isExisting);
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
            var path = Path.Combine(boxHome, BoxHomeEnvironmentsFileName);
            try
            {
                return File.Exists(path);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return false;
            }
        }
    }
}