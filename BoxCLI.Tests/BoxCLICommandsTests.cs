using System.IO;
using BoxCLI.BoxPlatform;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands;
using Microsoft.Extensions.CommandLineUtils;
using Xunit;

namespace BoxCLI.Tests
{
    public class BoxCLICommandsTests
    {
        
        [Fact]
        public void IsNamed_Box()
        {
            var options = GetBoxPlatformSettings();
            Assert.Equal("123", options.ClientId);
            Assert.Equal("321", options.ClientSecret);
            Assert.Equal("789", options.EnterpriseId);
            Assert.Equal("/private_key.pem", options.JwtPrivateKeyFilePath);
            
        }

        private CommandLineApplication GetBoxCLI()
        {
            var app = new CommandLineApplication();
            var user = new UserCommand();
            return app;
        }
    }
}