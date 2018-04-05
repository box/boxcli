using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public sealed class BoxUserRequestMap : CsvClassMap<BoxUserRequest>
    {
        public BoxUserRequestMap()
        {
            Map(m => m.Login);
            Map(m => m.Name);
            Map(m => m.IsPlatformAccessOnly);
            Map(m => m.Status);
            Map(m => m.Address);
            Map(m => m.Phone);
            Map(m => m.JobTitle);
            Map(m => m.Language);
            Map(m => m.SpaceAmount);
            Map(m => m.IsSyncEnabled);
            Map(m => m.IsExemptFromDeviceLimits);
            Map(m => m.IsExemptFromLoginVerification);
            Map(m => m.IsPasswordResetRequired);
            Map(m => m.CanSeeManagedUsers);
            // Map(m => m.TrackingCodes).TypeConverter<TrackingCodesConverter>();
        }
    }
}