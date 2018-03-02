using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxUserUpdateRequestMap : CsvClassMap<BoxUserRequest>
    {
        public BoxUserUpdateRequestMap()
        {
            Map(m => m.Id);
            Map(m => m.Name).Default(null);
            Map(m => m.Role).Default(null);
            Map(m => m.Status).Default(null);
            Map(m => m.Address).Default(null);
            Map(m => m.Phone).Default(null);
            Map(m => m.JobTitle).Default(null);
            Map(m => m.Language).Default(null);
            Map(m => m.SpaceAmount);
            Map(m => m.IsExemptFromDeviceLimits);
            Map(m => m.IsExemptFromLoginVerification);
            Map(m => m.IsSyncEnabled);
            Map(m => m.IsPasswordResetRequired);
            Map(m => m.CanSeeManagedUsers);
        }
    }
}
