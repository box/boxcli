using System;
namespace BoxCLI.BoxHome.Models
{
    public class BoxEnvironmentConfigFileValidation
    {
        public bool IsValid { get; set; } = false;
        public bool HasClientId { get; set; } = false;
        public bool HasClientSecret { get; set; } = false;
        public bool HasEnterpriseId { get; set; } = false;
        public bool HasPublicKeyId { get; set; } = false;
        public bool HasPrivateKeyValue { get; set; } = false;
        public bool HasInLinePrivateKey { get; set; } = false;
        public bool HasPrivateKeyPath { get; set; } = false;
    }
}
