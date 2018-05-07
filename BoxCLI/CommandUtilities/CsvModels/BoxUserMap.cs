using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using Box.V2.Models;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public sealed class BoxUserMap : CsvClassMap<BoxUser>
    {
        public BoxUserMap()
        {
            Map(m => m.Id);
            Map(m => m.Login);
            Map(m => m.Name);
            Map(m => m.Role);
            Map(m => m.Status);
            Map(m => m.Address);
            Map(m => m.Phone);
            Map(m => m.JobTitle);
            Map(m => m.Language);
            Map(m => m.MaxUploadSize);
            Map(m => m.SpaceUsed);
            Map(m => m.SpaceAmount);
            Map(m => m.CreatedAt).TypeConverterOption(DateTimeStyles.AdjustToUniversal);
            Map(m => m.ModifiedAt).TypeConverterOption(DateTimeStyles.AdjustToUniversal);
            References<BoxUserEnterpriseMap>(m => m.Enterprise);
            Map(m => m.AvatarUrl);
            Map(m => m.IsPlatformAccessOnly);
            Map(m => m.IsSyncEnabled);
            Map(m => m.IsExemptFromDeviceLimits);
            Map(m => m.IsExemptFromLoginVerification);
            Map(m => m.CanSeeManagedUsers);
            Map(m => m.TrackingCodes).TypeConverter<BoxUsersTrackingCodeConverter>();
        }
    }

    public sealed class BoxUserEnterpriseMap : CsvClassMap<BoxEnterprise>
    {
        public BoxUserEnterpriseMap()
        {
            Map(m => m.Id).Name("EnterpriseId");
            Map(m => m.Name).Name("EnterpriseName");
            Map(m => m.Type).Ignore();
        }
    }
    public class BoxUsersTrackingCodeConverter : DefaultTypeConverter
    {
        public override string ConvertToString(TypeConverterOptions options, object value)
        {
            var list = (List<BoxTrackingCode>)value;
            if (list == null)
            {
                list = new List<BoxTrackingCode>();
            }
            var trackingCodeStrings = new StringBuilder();
            for (var i = 0; i < list.Count; i++)
            {
                var trackingCode = list[i];
                trackingCodeStrings.Append($"name:{trackingCode.Name},value:{trackingCode.Value}");
                if (i != list.Count - 1)
                {
                    trackingCodeStrings.Append(Environment.NewLine);
                }
            }
            return trackingCodeStrings.ToString();
        }
    }
}