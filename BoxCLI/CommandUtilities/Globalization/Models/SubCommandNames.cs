namespace BoxCLI.CommandUtilities.Globalization.Models
{
    public class SubCommandNames
    {
        public string Get { get; set; } = "get";
        public string List { get; set; } = "list";
        public string ListItems { get; set; } = "list-items";
        public string Add { get; set; } = "add";
        public string Remove { get; set; } = "remove";
        public string GetAll { get; set; } = "get-all";
        public string GetCurrent { get; set; } = "get-current";
        public string SetCurrent { get; set; } = "set-current";
        public string Download { get; set; } = "download";
        public string Search { get; set; } = "search";
        public string Create { get; set; } = "create";
        public string Update { get; set; } = "update";
        public string Delete { get; set; } = "delete";
        public string Poll { get; set; } = "poll";
        public string Copy { get; set; } = "copy";
        public string Move { get; set; } = "move";
        public string Rename { get; set; } = "rename";
        public string Upload { get; set; } = "upload";
        public string Lock { get; set; } = "lock";
        public string Unlock { get; set; } = "unlock";
        public string Promote { get; set; } = "promote";
        public string UpdateLock { get; set; } = "update-lock";
        public string ChangeUploadEmail { get; set; } = "change-upload-email";
        public string BustCache { get; set; } = "bust-token-cache";
        public string SetAdminUser { get; set; } = "set-admin-user";
        public string GetAdminUser { get; set; } = "get-admin-user";
        public string GetDefaultUser { get; set; } = "get-default-user";
        public string SetDefaultUser { get; set; } = "set-default-user";
        public string StartUserSession { get; set; } = "start-user-session";
        public string EndUserSession { get; set; } = "end-user-session";
        public string GetSessionExpiration { get; set; } = "get-session-expiration";
        public string Exchange { get; set; } = "exchange";
        public string Revoke { get; set; } = "revoke";
    }
}