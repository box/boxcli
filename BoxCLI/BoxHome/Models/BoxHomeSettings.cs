using System.Collections.Generic;

namespace BoxCLI.BoxHome.Models
{
    public class BoxHomeSettings
    {
        public string BoxHomeEnvironmentVariable { get; set; } = "BOX_HOME";

        public string BoxHomeDirectoryName { get; set; } = ".box";
        public string BoxHomeEnvironmentsFileName { get; set; } = "box_environments.json";
        public string BoxHomeSettingsFileName { get; set; } = "settings.json";
        public string BoxHomeCacheFileName { get; set; } = "cache.json";
    }
}