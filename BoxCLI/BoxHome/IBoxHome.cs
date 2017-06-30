namespace BoxCLI.BoxHome
{
    public interface IBoxHome
    {
        string GetBoxHomeDirectoryPath();

        void RemoveBoxHomeDirectory();

        BoxEnvironments GetBoxEnvironments();
        BoxPersistantCache GetBoxCache();

    }
}