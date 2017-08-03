using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxFolderUpdateRequestMap : CsvClassMap<BoxFolderRequest>
    {
        public BoxFolderUpdateRequestMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
            Map(m => m.Description);
            Map(m => m.SyncState);
            Map(m => m.Parent).ConvertUsing<BoxRequestEntity>(row =>
            {
                var field = row.GetField("ParentId");
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
            Map(m => m.FolderUploadEmail).ConvertUsing<BoxEmailRequest>(row =>
            {
                var field = row.GetField("FolderUploadEmailAccess");
                if(string.IsNullOrEmpty(field))
                {
                    return null;
                }
                else 
                {
                    return new BoxEmailRequest()
                    {
                        Access = field
                    };
                }
            });
            Map(m => m.SharedLink).ConvertUsing<BoxSharedLinkRequest>(row => 
            {
                var access = row.GetField("SharedLinkAccess");
                var password = row.GetField("SharedLinkPassword");
                var unsharedAt = row.GetField("SharedLinkUnsharedAt");
                var canDownload = row.GetField("SharedLinkCanDownload");
                if(string.IsNullOrEmpty(access) && string.IsNullOrEmpty(password)
                  && string.IsNullOrEmpty(unsharedAt) && string.IsNullOrEmpty(canDownload))
                {
                    return null;
                }
                else
                {
                    var sharedLinkRequest = new BoxSharedLinkRequest();
                    if(!string.IsNullOrEmpty(access))
                    {
                        sharedLinkRequest.Access = access;
                    }
                    if(!string.IsNullOrEmpty(password))
                    {
                        sharedLinkRequest.Password = password;
                    }
                    if(!string.IsNullOrEmpty(unsharedAt))
                    {
                        sharedLinkRequest.UnsharedAt = Convert.ToDateTime(unsharedAt);
                    }
                    if(!string.IsNullOrEmpty(canDownload))
                    {
                        sharedLinkRequest.Permissions = new BoxPermissionsRequest();
                        sharedLinkRequest.Permissions.Download = Convert.ToBoolean(canDownload);
                    }
                    return sharedLinkRequest;
                }
            });
        }
    }
}
