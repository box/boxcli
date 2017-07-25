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

namespace BoxCLI.Commands
{
    public abstract class BoxBaseCommand : HelpCommandBaseAsync
    {
        protected readonly IBoxHome _boxHome;
        protected readonly BoxDefaultSettings _settings;
        protected readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        protected readonly LocalizedStringsResource _names;


        public BoxBaseCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
            _boxHome = boxHome;
            _settings = boxHome.GetBoxHomeSettings();
            _names = names;
        }

        public override void Configure(CommandLineApplication command)
        {
            base.Configure(command);
        }

        protected virtual void PrintMiniUser(BoxUser u)
        {
            Reporter.WriteInformation($"User ID: {u.Id}");
            Reporter.WriteInformation($"User Name: {u.Name}");
            Reporter.WriteInformation($"User Login: {u.Login}");
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

        protected virtual BoxClient ConfigureBoxClient(string oneCallAsUserId = null, bool returnAdmin = false)
        {
            var Box = _boxPlatformBuilder.Build();
            if (!string.IsNullOrEmpty(oneCallAsUserId) && !returnAdmin)
            {
                return Box.AsUserClient(oneCallAsUserId);
            }
            else if (_settings.GetBoxReportsUseDefaultAsUserSetting() && !returnAdmin)
            {
                return Box.AsUserClient(_settings.GetBoxReportsDefaultAsUserIdSetting());
            }
            else if (_settings.GetBoxReportsUseTempAsUserSetting() && !returnAdmin)
            {
                return Box.AsUserClient(_settings.GetBoxReportsTempAsUserIdSetting());
            }
            else
            {
                return Box.AdminClient();
            }
        }

        protected virtual IBoxCollectionsIterators GetIterators()
        {
            var Box = _boxPlatformBuilder.Build();
            return Box.BoxCollectionsIterators;
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
                using (var stringReader = new StringReader(jsonString))
                using (var jsonReader = new JsonTextReader(stringReader))
                {
                    while (jsonReader.Read())
                    {
                        if (jsonReader.TokenType == JsonToken.PropertyName
                            && (string)jsonReader.Value == "id")
                        {
                            jsonReader.Read();

                            var serializer = new JsonSerializer();
                            ids.Add(serializer.Deserialize<string>(jsonReader));
                        }
                    }
                }
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

        protected virtual List<T> ReadFile<T, M>(string path)
        {
            System.Console.WriteLine("Inside reader...");
            var fileFormat = this.ProcessFileFormatFromPath(path);
            System.Console.WriteLine($"File is {fileFormat}");
            if (fileFormat == _settings.FILE_FORMAT_JSON)
            {
                var jsonString = File.ReadAllText(path);
                var converter = new BoxJsonConverter();
                return converter.Parse<List<T>>(jsonString);
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