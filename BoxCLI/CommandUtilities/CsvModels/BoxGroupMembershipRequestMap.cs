using System;
using Box.V2.Models;
using Box.V2.Models.Request;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupMembershipRequestMap : CsvClassMap<BoxGroupMembershipRequest>
    {
        public BoxGroupMembershipRequestMap()
        {
            Map(m => m.Role);
            Map(m => m.User).ConvertUsing<BoxRequestEntity>(row =>
            {
                var field = row.GetField("BoxUserId");
                if (string.IsNullOrEmpty(field))
                {
                    return null;
                }
                else
                {
                    return new BoxRequestEntity()
                    {
                        Id = field
                    };
                }
            });
            Map(m => m.Group).ConvertUsing<BoxGroupRequest>(row =>
            {
                var field = row.GetField("BoxGroupId");
                if (string.IsNullOrEmpty(field))
                {
                    return null;
                }
                else
                {
                    return new BoxGroupRequest()
                    {
                        Id = field
                    };
                }
            });
        }
    }
}
