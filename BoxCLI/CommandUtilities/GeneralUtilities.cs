using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Box.V2.Converter;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BoxCLI.CommandUtilities
{
    public static class GeneralUtilities
    {
        public static DateTime ResolveTimeUnit(double span, char unit)
        {
            switch (unit)
            {
                case 's':
                    return DateTime.Now.AddSeconds(span);
                case 'm':
                    return DateTime.Now.AddMinutes(span);
                case 'h':
                    return DateTime.Now.AddHours(span);
                case 'd':
                    return DateTime.Now.AddDays(span);
                case 'w':
                    return DateTime.Now.AddDays(span * 7);
                case 'M':
                    return DateTime.Now.AddMonths(Convert.ToInt32(span));
                case 'n':
                    return DateTime.Now;
                default:
                    throw new Exception("Time format unrecognized.");
            }
        }
        public static DateTime GetDateTimeFromString(string t, bool allowNegativeTime = false)
        {
            t = t.Trim();
            var now = "now";
            var pattern = @"^[0-6][0-9]{1}[s,m,h,d,w,M]$";
            var negativePattern = @"^-[0-6][0-9]{1}[s,m,h,d,w,M]$";
            var regex = new Regex(pattern);
            var negativeRegex = new Regex(negativePattern);
            if (regex.Match(t).Success)
            {
                var unit = t[2];
                double span;
                double.TryParse(t.Substring(0, 2), out span);
                return ResolveTimeUnit(span, unit);
            }
            else if (negativeRegex.Match(t).Success && allowNegativeTime)
            {
                var unit = t[3];
                double span;
                double.TryParse(t.Substring(0, 3), out span);
                return ResolveTimeUnit(span, unit);
            }
            else if (now == t)
            {
                return ResolveTimeUnit(0, 'n');
            }
            else
            {
                throw new Exception("Time format unrecognized.");
            }
        }
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

        private static string ResolveContainerPath(string containerPath)
        {
            return containerPath.Substring(0, containerPath.LastIndexOf(Path.DirectorySeparatorChar));
        }

        public static string ResolveItemName(string path)
        {
            if (path.Last() == Path.DirectorySeparatorChar)
            {
                path = path.Substring(0, path.Length - 1);
            }
            return path.Substring(path.LastIndexOf(Path.DirectorySeparatorChar) + 1);
        }

        public static string TranslateDependentPath(string path, string containerPath)
        {
            var pathContents = new List<string>();
            var winDirectoryRegex = new Regex(@"^[a-zA-Z]:\\");
            var winDirectory = "";
            if (path.StartsWith("~"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveTilde()}{path}";
            }
            if (path.StartsWith($".{Path.DirectorySeparatorChar}"))
            {
                path = path.Substring(1, path.Length - 1);
                path = $"{ResolveContainerPath(containerPath)}{Path.DirectorySeparatorChar}{path}";
            }
            if (path.StartsWith(".."))
            {
                path = Path.GetFullPath($"{ResolveContainerPath(containerPath)}{Path.DirectorySeparatorChar}{path}");
            }

            if (winDirectoryRegex.IsMatch(path))
            {
                var match = winDirectoryRegex.Match(path);
                winDirectory = match.Value;
                path = path.Substring(match.Length - 1);
            }

            if (path.StartsWith("/"))
            {
                return path;
            }

            if (!path.StartsWith(Path.DirectorySeparatorChar.ToString()) && !path.StartsWith("~") && !path.StartsWith("..") &&
            !path.StartsWith($".{Path.DirectorySeparatorChar}") && !winDirectoryRegex.IsMatch(path))
            {
                path = $"{ResolveContainerPath(containerPath)}{Path.DirectorySeparatorChar}{path}";
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

        public static string TranslatePath(string path)
        {
            var pathContents = new List<string>();
            var winDirectoryRegex = new Regex(@"^[a-zA-Z]:\\");
            var winDirectory = "";
            if (path.StartsWith("~"))
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

            if (path.StartsWith("/"))
            {
                return path;
            }

            if (!path.StartsWith(Path.DirectorySeparatorChar.ToString()) && !path.StartsWith("~") && !path.StartsWith("..") &&
            !path.StartsWith($".{Path.DirectorySeparatorChar}") && !winDirectoryRegex.IsMatch(path))
            {
                path = $"{ResolveDot()}{Path.DirectorySeparatorChar}{path}";
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

        public static string GetDateFormatString()
        {
            return "yyyy-MM-ddTHH_mm_ss";
        }

        public static string FormatErrorResponseFromAPI(Exception ex)
        {
            try
            {
                if (!string.IsNullOrEmpty(ex.InnerException.Message))
                {
                    return JValue.Parse(ex.InnerException.Message).ToString(Formatting.Indented);
                }
                else
                {
                    return JValue.Parse(ex.Message).ToString(Formatting.Indented);
                }

            }
            catch
            {
                if (ex == null)
                {
                    return string.Empty;
                }
                if (!string.IsNullOrEmpty(ex.Message) && ex.InnerException != null && !string.IsNullOrEmpty(ex.InnerException.Message))
                {
                    return ex.InnerException.Message;
                }
                else
                {
                    return ex.Message;
                }
            }
        }
    }
}