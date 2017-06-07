namespace BoxCLI.BoxPlatform.Cache
{
    public interface IBoxCachedToken
    {
        string AccessToken { get; set; }
        string ExpiresAt { get; set; }
    }
}