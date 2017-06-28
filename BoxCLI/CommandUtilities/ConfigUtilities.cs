using System;
using System.IO;
using Box.V2.Config;

namespace BoxCLI.ConfigUtilities
{
    public static class ConfigUtilities
    {
        const string BOX_DIRECTORY_NAME = ".box";
        const string BOX_HOME_ENV_VAR = "BOX_HOME";

        public static bool CheckIfBoxDirectoryExists()
        {
            try
            {
                var home = GetBoxDirectoryPath();
                var homePath = Path.GetFullPath(home);
                var boxHome = Path.Combine(homePath, BOX_DIRECTORY_NAME);
                return Directory.Exists(boxHome);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                return false;
            }
        }

        public static string GetBoxDirectoryPath()
        {
            var home = GetBaseDirectoryPath();
            home = Path.Combine(home, BOX_DIRECTORY_NAME);
            return home;
        }

        public static string GetBaseDirectoryPath()
        {
            var home = Environment.GetEnvironmentVariable(BOX_HOME_ENV_VAR);
            if (string.IsNullOrEmpty(home))
            {
                home = Environment.GetEnvironmentVariable("HOME");
                if (string.IsNullOrEmpty(home))
                {
                    throw new Exception("Cannot locate the user directory.");
                }
            }
            return home;
        }

        public static string CreateBoxDirectory()
        {
            var baseDirectoryPath = GetBaseDirectoryPath();
            if (!CheckIfBoxDirectoryExists())
            {
                var path = Path.Combine(baseDirectoryPath, BOX_DIRECTORY_NAME);
                var newDir = Directory.CreateDirectory(path);
                return path;
            }
            else
            {
                return GetBoxDirectoryPath();
            }
        }

        public static void RemoveBoxDirectory()
        {
            var boxDir = GetBoxDirectoryPath();
            Directory.Delete(boxDir, true);
        }

        public static bool VerifyBoxConfigFile(string filePath)
        {
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
    }
}