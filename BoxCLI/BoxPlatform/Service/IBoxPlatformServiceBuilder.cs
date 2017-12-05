using BoxCLI.BoxPlatform.Cache;

namespace BoxCLI.BoxPlatform.Service
{
    public interface IBoxPlatformServiceBuilder
    {
        IBoxPlatformService Build(bool isTokenCall = false);
    }
}