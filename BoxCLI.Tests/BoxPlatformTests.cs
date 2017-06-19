using System.IO;
using BoxCLI.BoxPlatform;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Tests.TestUtilities;
using Moq;
using Xunit;

namespace BoxCLI.Tests
{
    public class BoxPlatformTests
    {   
        [Fact]
        public void CanGet_BoxPlatformSettings_Manually()
        {
            var options = BoxTestUtilities.GetBoxPlatformSettings();
            Assert.Equal("123", options.ClientId);
            Assert.Equal("321", options.ClientSecret);
            Assert.Equal("789", options.EnterpriseId);
            Assert.Equal("/private_key.pem", options.JwtPrivateKeyFilePath);
            
        }
    }
}