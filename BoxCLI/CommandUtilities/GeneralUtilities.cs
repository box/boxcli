using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

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
    }
}