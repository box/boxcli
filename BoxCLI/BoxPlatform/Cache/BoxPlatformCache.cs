using System;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Utilities;

namespace BoxCLI.BoxPlatform.Cache
{
    public class BoxPlatformCache : IBoxPlatformCache
    {
        public const string CACHE_PREFIX = "box_platform";
        public const string ENTERPRISE = "enterprise";
        public const string EXPIRES_AT = "expires_at";
        public const string CACHE_DELIMITER = "/";

        private static readonly TimeSpan TOKEN_EXPIRATION_PERIOD = TimeSpan.FromMinutes(45);
        private static readonly DateTime EPOCH = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        private readonly IMemoryCache _memoryCache;

        public BoxPlatformCache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public IBoxCachedToken GetToken(BoxTokenTypes tokenType, string tokenId, Func<string> generateToken)
        {
            string tokenString;
            var token = new BoxCachedToken();
            var tokenTypeString = String.Empty;

            if (tokenType == BoxTokenTypes.Enterprise)
            {
                tokenTypeString = ENTERPRISE;
            }
            if (String.IsNullOrWhiteSpace(tokenTypeString))
            {
                throw new Exception("Token Type must be Enterprise or User");
            }

            var tokenKey = ConstructCacheKey(tokenTypeString, tokenId);

            //Check in-memory cache for token first...
            if (!_memoryCache.TryGetValue(tokenKey, out tokenString))
            {
                //Check that the token isn't expired.
                if (IsTokenExpired(token))
                {
                    token = HandleExpiredOrEmptyToken(token, tokenKey, generateToken);
                    SetTokenInMemory(tokenKey, JsonConvert.SerializeObject(token), ReturnNewInMemoryCacheExpirationFromCachedToken(ref token, tokenKey, generateToken));
                    return token;
                }
                else
                {
                    return HandleExpiredOrEmptyToken(token, tokenKey, generateToken);
                }
            }
            else
            {
                token = DeserializeToken(tokenString);
                if (IsTokenExpired(token))
                {
                    token = HandleExpiredOrEmptyToken(token, tokenKey, generateToken);
                }
                return token;
            }
        }

        private BoxCachedToken DeserializeToken(string token)
        {
            return JsonConvert.DeserializeObject<BoxCachedToken>(token);
        }

        private BoxCachedToken CheckPersistentCache(string tokenKey)
        {
            var token = new BoxCachedToken();
            // var value = _distributedCache.Get(tokenKey);
            // if (value != null)
            // {
            //     token = DeserializeToken(Encoding.UTF8.GetString(value));
            // }
            return token;
        }

        private BoxCachedToken HandleExpiredOrEmptyToken(BoxCachedToken token, string tokenKey, Func<string> generateToken)
        {
            token.AccessToken = null;
            token.ExpiresAt = null;
            token.AccessToken = generateToken();
            token = AddExpirationToToken(token);
            var tokenString = JsonConvert.SerializeObject(token);
            SetTokenInMemory(tokenKey, tokenString);
            SetTokenInPersistentCache(tokenKey, tokenString);
            return token;
        }

        private void SetTokenInMemory(string tokenKey, string token)
        {
            this._memoryCache.Set(tokenKey, token, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TOKEN_EXPIRATION_PERIOD));
        }

        private void SetTokenInMemory(string tokenKey, string token, TimeSpan expirationFromDistrubutedCache)
        {
            this._memoryCache.Set(tokenKey, token, new MemoryCacheEntryOptions().SetAbsoluteExpiration(expirationFromDistrubutedCache));
        }

        private void SetTokenInPersistentCache(string tokenKey, string token)
        {
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            // this._distributedCache.Set(tokenKey, tokenBytes, new DistributedCacheEntryOptions().SetAbsoluteExpiration(TOKEN_EXPIRATION_PERIOD));
        }

        private BoxCachedToken AddExpirationToToken(BoxCachedToken token)
        {
            if (token.ExpiresAt == null)
            {
                var expirationTime = DateTime.UtcNow.Add(TOKEN_EXPIRATION_PERIOD);
                var timestamp = ToUnixTimestamp(expirationTime);
                token.ExpiresAt = timestamp.ToString();
            }
            return token;
        }

        private bool IsTokenExpired(BoxCachedToken token)
        {
            if (token.ExpiresAt == null)
            {
                return true;
            }

            var expirationTime = ToDateTimeFromUnixTimestamp(token.ExpiresAt);
            if (DateTime.Now.CompareTo(expirationTime) > -1)
            {
                return true;
            }
            return false;
        }

        private TimeSpan ReturnNewInMemoryCacheExpirationFromCachedToken(ref BoxCachedToken token, string tokenKey, Func<string> generateToken)
        {
            var timeRemaining = ToDateTimeFromUnixTimestamp(token.ExpiresAt).Subtract(DateTime.Now);
            if (timeRemaining.Minutes <= 0)
            {
                token = HandleExpiredOrEmptyToken(token, tokenKey, generateToken);
                return TOKEN_EXPIRATION_PERIOD;
            }
            return TimeSpan.FromMinutes(timeRemaining.Minutes);
        }

        private static long ToUnixTimestamp(DateTime input)
        {
            var time = input.Subtract(new TimeSpan(EPOCH.Ticks));
            return (long)(time.Ticks / 10000);
        }

        private static DateTime ToDateTimeFromUnixTimestamp(string timestamp)
        {
            return EPOCH.AddMilliseconds(Convert.ToInt64(timestamp)).ToLocalTime();
        }

        private string ConstructCacheKey(string tokenType, string tokenId)
        {
            return CACHE_PREFIX + CACHE_DELIMITER + tokenType + CACHE_DELIMITER + tokenId;
        }
    }
}