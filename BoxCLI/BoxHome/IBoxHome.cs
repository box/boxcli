using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Cache;

namespace BoxCLI.BoxHome
{
    public interface IBoxHome
    {
        string GetBoxHomeDirectoryPath();
        string GetBaseDirectoryPath();

        void RemoveBoxHomeDirectory();

        BoxEnvironments GetBoxEnvironments();
        BoxPersistantCache GetBoxCache();
        BoxDefaultSettings GetBoxHomeSettings();
        BoxCachedToken BustCache();

    }
}