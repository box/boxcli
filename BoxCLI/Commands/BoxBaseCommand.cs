using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Box.V2;
using Box.V2.Converter;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using CsvHelper;
using Microsoft.Extensions.CommandLineUtils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BoxCLI.Commands
{
    public abstract class BoxBaseCommand : HelpCommandBaseAsync
    {
        protected readonly IBoxHome _boxHome;
        protected readonly BoxDefaultSettings _settings;
        protected readonly BoxEnvironments _environments;
        protected readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        protected readonly LocalizedStringsResource _names;


        public BoxBaseCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
            _boxHome = boxHome;
            _settings = boxHome.GetBoxHomeSettings();
            _environments = boxHome.GetBoxEnvironments();
            _names = names;
        }

        public override void Configure(CommandLineApplication command)
        {
            base.Configure(command);
        }

        protected virtual void CheckForId(string id, CommandLineApplication app, string message = "")
        {
            if (string.IsNullOrEmpty(id))
            {
                app.ShowHelp();
                message = (string.IsNullOrEmpty(message)) ? "An ID is required for this command." : message;
                throw new Exception(message);
            }
        }

        protected virtual void PrintCollaboration(BoxCollaboration c)
        {
            Reporter.WriteInformation($"Collaboration ID: {c.Id}");
            if (c.Item != null)
            {
                Reporter.WriteInformation("Collaboration Item: ");
                this.PrintItem(c.Item);
            }
            Reporter.WriteInformation($"Collaboration Role: {c.Role}");
            Reporter.WriteInformation($"Collaboration Status: {c.Status}");
            if (c.CreatedBy != null)
            {
                Reporter.WriteInformation("Created by: ");
                this.PrintMiniUser(c.CreatedBy);
            }
        }
        protected virtual void PrintMiniUser(BoxUser u)
        {
            Reporter.WriteInformation($"User ID: {u.Id}");
            Reporter.WriteInformation($"User Name: {u.Name}");
            Reporter.WriteInformation($"User Login: {u.Login}");
        }
        protected virtual void PrintItem(BoxItem item)
        {
            Reporter.WriteInformation($"Item ID: {item.Id}");
            Reporter.WriteInformation($"Item Name: {item.Name}");
            Reporter.WriteInformation($"Item Type: {item.Type}");
        }

        protected virtual string ConstructReportPath(string fileName, string filePath = "")
        {
            if (string.IsNullOrEmpty(filePath))
            {
                filePath = _settings.GetBoxReportsFolderPath();
            }
            if (!filePath.EndsWith(Path.DirectorySeparatorChar.ToString()))
            {
                filePath = $"{filePath}{Path.DirectorySeparatorChar}";
            }
            return $"{filePath}{fileName}";
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

        protected virtual BoxClient ConfigureBoxClient(string oneCallAsUserId = null,
        bool returnServiceAccount = false, bool asAdmin = false)
        {
            var Box = _boxPlatformBuilder.Build();
            if (!string.IsNullOrEmpty(oneCallAsUserId) && !returnServiceAccount)
            {
                return Box.AsUserClient(oneCallAsUserId);
            }
            else if (asAdmin && !returnServiceAccount)
            {
                if (string.IsNullOrEmpty(this._environments.GetAdminAsUserIdSetting()))
                {
                    throw new Exception("Admin User ID is not currently set. Use the box configure environments set-admin-user command to use this feature.");
                }
                return Box.AsUserClient(this._environments.GetAdminAsUserIdSetting());
            }
            else if (this._environments.GetUserSessionEnabledSetting() && !returnServiceAccount)
            {
                Reporter.WriteInformation("User session enabled...");
                var expiresAt = this._environments.GetUserSessionExpirationSetting();
                if (!expiresAt.HasValue || expiresAt < DateTime.Now)
                {
                    this._environments.ExpireUserSession();
                    throw new Exception("User session is expired.");
                }
                Reporter.WriteInformation("Checking for user...");
                string id;
                if (this._environments.GetUseDefaultAsUserSetting())
                {
                    id = this._environments.GetDefaultAsUserIdSetting();
                }
                else
                {
                    id = this._environments.GetTempAsUserIdSetting();
                }
                Reporter.WriteInformation($"Calls made on-behalf of user {id}");
                return Box.AsUserClient(id);
            }
            else
            {
                return Box.AdminClient();
            }
        }

        protected virtual IBoxCollectionsIterators GetIterators()
        {
            var box = _boxPlatformBuilder.Build();
            return box.BoxCollectionsIterators;
        }

        protected BoxType ProcessType(string type)
        {
            if (type.ToLower() == "file")
            {
                return BoxType.file;
            }
            else if (type.ToLower() == "folder")
            {
                return BoxType.folder;
            }
            else
            {
                throw new Exception("Not a valid Box item type to collaborate.");
            }
        }

        protected virtual void OutputJson<T>(T entity)
        {
            var converter = new BoxJsonConverter();
            Reporter.WriteInformation(converter.Serialize<T>(entity));
        }

        protected virtual bool WriteResultsToReport<T>(T entity, string fileName, string filePath = "", string fileFormat = "")
        {
            fileFormat = this.ProcessReportsFileFormat(fileFormat);
            filePath = this.ProcessReportsFilePathForWriters(filePath, fileName, fileFormat);
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                var converter = new BoxJsonConverter();
                File.WriteAllText(filePath, converter.Serialize<T>(entity));
                return true;
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                try
                {
                    using (StreamWriter fs = File.CreateText(filePath))
                    using (var csv = new CsvWriter(fs))
                    {
                        csv.WriteRecord(entity);
                    }
                    return true;
                }
                catch
                {
                    return false;
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
        }

        protected virtual bool WriteListResultsToReport<T, M>(List<T> entity, string fileName, string filePath = "", string fileFormat = "")
            where T : BoxEntity, new()
        {
            System.Console.WriteLine("Starting writer...");
            fileFormat = this.ProcessReportsFileFormat(fileFormat);
            filePath = this.ProcessReportsFilePathForWriters(filePath, fileName, fileFormat);
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                try
                {
                    System.Console.WriteLine("Writing JSON file...");
                    var converter = new BoxJsonConverter();
                    var collection = new BoxCollection<T>();
                    collection.Entries = new List<T>();
                    collection.Entries.AddRange(entity);
                    File.WriteAllText(filePath, converter.Serialize<BoxCollection<T>>(collection));
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                try
                {
                    using (StreamWriter fs = File.CreateText(filePath))
                    using (var csv = new CsvWriter(fs))
                    {
                        csv.Configuration.RegisterClassMap(typeof(M));
                        csv.WriteRecords(entity);
                    }
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
        }
        protected virtual bool WriteOffsetCollectionResultsToReport<T, M>(BoxCollection<T> entity, string fileName, string filePath = "", string fileFormat = "")
            where T : BoxEntity, new()
        {
            System.Console.WriteLine("Starting writer...");
            fileFormat = this.ProcessReportsFileFormat(fileFormat);
            filePath = this.ProcessReportsFilePathForWriters(filePath, fileName, fileFormat);
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                try
                {
                    System.Console.WriteLine("Writing JSON file...");
                    var converter = new BoxJsonConverter();
                    File.WriteAllText(filePath, converter.Serialize<BoxCollection<T>>(entity));
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                try
                {
                    using (StreamWriter fs = File.CreateText(filePath))
                    using (var csv = new CsvWriter(fs))
                    {
                        csv.Configuration.RegisterClassMap(typeof(M));
                        csv.WriteRecords(entity.Entries);
                    }
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
        }
        protected virtual bool WriteMarkerCollectionResultsToReport<T, M>(BoxCollectionMarkerBased<T> entity, string fileName, string filePath = "", string fileFormat = "")
            where T : BoxEntity, new()
        {
            System.Console.WriteLine("Starting writer...");
            fileFormat = this.ProcessReportsFileFormat(fileFormat);
            filePath = this.ProcessReportsFilePathForWriters(filePath, fileName, fileFormat);
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                try
                {
                    System.Console.WriteLine("Writing JSON file...");
                    var converter = new BoxJsonConverter();
                    File.WriteAllText(filePath, converter.Serialize<BoxCollectionMarkerBased<T>>(entity));
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                try
                {
                    using (StreamWriter fs = File.CreateText(filePath))
                    using (var csv = new CsvWriter(fs))
                    {
                        csv.Configuration.RegisterClassMap(typeof(M));
                        csv.WriteRecords(entity.Entries);
                    }
                    return true;
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return false;
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }

        }

        protected virtual List<string> ReadFileForIds(string path)
        {
            var fileFormat = this.ProcessFileFormatFromPath(path);
            var ids = new List<string>();
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                var jsonString = File.ReadAllText(path);
                var jsonIds = JObject.Parse(jsonString)
                 .GetValue("entries")
                 .Children()
                 .Select(p => p["id"].Value<string>());
                ids.AddRange(jsonIds);
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                using (var fs = File.OpenText(path))
                using (var csv = new CsvReader(fs))
                {
                    while (csv.Read())
                    {
                        ids.Add(csv.GetField<string>("Id"));
                    }
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
            return ids;
        }

        protected virtual List<T> ReadFile<T, M>(string path) where T : class, new()
        {
            System.Console.WriteLine("Inside reader...");
            var fileFormat = this.ProcessFileFormatFromPath(path);
            System.Console.WriteLine($"File is {fileFormat}");
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                var jsonString = File.ReadAllText(path);
                var converter = new BoxJsonConverter();
                var collection = converter.Parse<BoxCollection<T>>(jsonString);
                return collection.Entries.ToList();
            }
            else if (fileFormat == _settings.FILE_FORMAT_CSV)
            {
                System.Console.WriteLine("Found csv file...");
                using (var fs = File.OpenText(path))
                using (var csv = new CsvReader(fs))
                {
                    System.Console.WriteLine("Processing csv...");
                    csv.Configuration.RegisterClassMap(typeof(M));
                    return csv.GetRecords<T>().ToList();
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
        }

        protected virtual List<string> ProcessFields(string rawFields, List<string> baseFields)
        {
            var fields = new List<string>();
            if (string.IsNullOrEmpty(rawFields))
            {
                fields = baseFields;
            }
            else
            {
                fields = new List<string>(rawFields.Split(','));
            }
            return fields;
        }

        private string ProcessReportsFilePathForWriters(string filePath, string fileName, string fileFormat)
        {
            return $"{this.ConstructReportPath(fileName, filePath)}.{fileFormat}";
        }

        private string ProcessReportsFileFormat(string fileFormat = "")
        {
            if (string.IsNullOrEmpty(fileFormat))
            {
                System.Console.WriteLine("Finding default file format...");
                fileFormat = _settings.GetBoxReportsFileFormatSetting();
                System.Console.WriteLine($"Default file format: {fileFormat}");
            }
            return fileFormat.ToLower();
        }

        protected string ProcessFileFormatFromPath(string path)
        {
            var fileFormat = Path.GetExtension(path);
            if (fileFormat.StartsWith("."))
            {
                fileFormat = fileFormat.Substring(1);
            }
            return fileFormat;
        }
    }
}