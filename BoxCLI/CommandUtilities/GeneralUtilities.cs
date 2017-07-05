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
            System.Console.WriteLine("Constructing filepath...");
            var pathContents = new List<string>();
            var winDirectoryRegex = new Regex(@"^[a-zA-Z]:\\");
            var winDirectory = "";
            if (path.Contains("~"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveTilde()}{path}";
                System.Console.WriteLine("Altered Path");
                System.Console.WriteLine(path);
            }

            if (winDirectoryRegex.IsMatch(path))
            {
                System.Console.WriteLine("Found win directory...");
                var match = winDirectoryRegex.Match(path);
                winDirectory = match.Value;
                path = path.Substring(match.Length - 1);
                System.Console.WriteLine($"Path: {path}");
                System.Console.WriteLine($"WinDir: {winDirectory}");
            }
            System.Console.WriteLine(winDirectory);

            if (path.Contains("/"))
            {
                System.Console.WriteLine("Splitting on /");
                pathContents.AddRange(path.Split('/'));
            }

            if (path.Contains("\\"))
            {
                System.Console.WriteLine("Splitting on \\");
                pathContents.AddRange(path.Split('\\'));
            }
            pathContents = pathContents.Where(x => !string.IsNullOrEmpty(x)).ToList();
            System.Console.WriteLine("Final path contents");
            System.Console.WriteLine(pathContents.Count);
            var resolvedPath = "";
            if (pathContents.Count > 0)
            {
                resolvedPath = Path.Combine(pathContents.ToArray());

                if (!resolvedPath.StartsWith(Path.DirectorySeparatorChar.ToString()) && string.IsNullOrEmpty(winDirectory))
                {
                    System.Console.WriteLine("Adding");
                    resolvedPath = $"{Path.DirectorySeparatorChar}{resolvedPath}";
                }
                else
                {
                    System.Console.WriteLine("Joining winDirectory and resolvedPath");
                    resolvedPath = $"{winDirectory}{resolvedPath}";
                    System.Console.WriteLine(resolvedPath);
                }
            }
            System.Console.WriteLine(("Final value:"));
            System.Console.WriteLine((resolvedPath));
            return resolvedPath;
        }
    }
}