using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Box.V2.Converter;

namespace BoxCLI.CommandUtilities
{
    public static class GeneralUtilities
    {
        private static string ResolveTilde()
        {
            var home = Environment.GetEnvironmentVariable("HOME");
            if (string.IsNullOrEmpty(home))
            {
                home = Environment.GetEnvironmentVariable("USERPROFILE");
                if (string.IsNullOrEmpty(home))
                {
                    throw new Exception($"Cannot locate the Home directory.");
                }
            }
            return Path.GetFullPath(home);
        }

        private static string ResolveDot()
        {
            return Directory.GetCurrentDirectory();
        }

        private static string ResolveDoubleDot(string path)
        {
            return Path.GetFullPath($"{Directory.GetCurrentDirectory()}{Path.DirectorySeparatorChar}{path}");
        }

        public static string TranslatePath(string path)
        {
            var pathContents = new List<string>();
            var winDirectoryRegex = new Regex(@"^[a-zA-Z]:\\");
            var winDirectory = "";
            if (path.Contains("~"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveTilde()}{path}";
            }
            if (path.StartsWith($".{Path.DirectorySeparatorChar}"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveDot()}{path}";
            }
            if (path.StartsWith(".."))
            {
                path = ResolveDoubleDot(path);
            }

            if (winDirectoryRegex.IsMatch(path))
            {
                var match = winDirectoryRegex.Match(path);
                winDirectory = match.Value;
                path = path.Substring(match.Length - 1);
            }

            if (path.Contains("/"))
            {
                pathContents.AddRange(path.Split('/'));
            }

            if (path.Contains("\\"))
            {
                pathContents.AddRange(path.Split('\\'));
            }
            pathContents = pathContents.Where(x => !string.IsNullOrEmpty(x)).ToList();
            var resolvedPath = "";
            if (pathContents.Count > 0)
            {
                resolvedPath = Path.Combine(pathContents.ToArray());

                if (!resolvedPath.StartsWith(Path.DirectorySeparatorChar.ToString()) && string.IsNullOrEmpty(winDirectory))
                {
                    resolvedPath = $"{Path.DirectorySeparatorChar}{resolvedPath}";
                }
                else
                {
                    resolvedPath = $"{winDirectory}{resolvedPath}";
                }
            }
            return resolvedPath;
        }

        public static string JsonWriter<T>(T entity)
        {
            var converter = new BoxJsonConverter();
            return converter.Serialize<T>(entity);
        
        }
        public static T JsonReader<T>(string json)
        {
            var converter = new BoxJsonConverter();
            return converter.Parse<T>(json);
        }

        public static string GetDateFormatString()
        {
            return "yyyy-MM-dd:HH:mm:ss";
        }
    }
}