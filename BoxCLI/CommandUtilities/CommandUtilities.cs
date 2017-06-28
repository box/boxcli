using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BoxCLI.CommandUtilities
{
    public static class CommandUtilities
    {
        public static string ResolveTilde()
        {
            var home = Environment.GetEnvironmentVariable("HOME");
            return Path.GetFullPath(home);
        }

        public static string TranslatePath(string path)
        {
            var pathContents = new List<string>();
            if (path.Contains("~"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveTilde()}{path}";
                System.Console.WriteLine("Altered Path");
                System.Console.WriteLine(path);
            }

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

            var resolvedPath = "";
            if (pathContents.Count > 0)
            {
                resolvedPath = Path.Combine(pathContents.ToArray());
                if (!resolvedPath.StartsWith(Path.DirectorySeparatorChar.ToString()))
                {
                    resolvedPath = $"{Path.DirectorySeparatorChar}{resolvedPath}";
                }
            }
            return resolvedPath;
        }
    }
}