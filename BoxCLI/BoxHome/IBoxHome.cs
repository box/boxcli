using BoxCLI.BoxHome.BoxHomeFiles;

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
        void BustCache();

    }
}