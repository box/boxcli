using Newtonsoft.Json;

namespace BoxCLI.BoxPlatform.Cache
{
    public class BoxCachedToken : IBoxCachedToken
    {
        [JsonProperty(PropertyName = "access_token")]
        public string AccessToken { get; set; }

        [JsonProperty(PropertyName = "expires_at")]
        public string ExpiresAt { get; set; }
    }
}