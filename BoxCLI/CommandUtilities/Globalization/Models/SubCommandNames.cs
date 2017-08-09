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
        public string GetDefaultUser { get; set; } = "get-default-as-user";
        public string SetDefaultUser { get; set; } = "set-default-as-user";
        public string StartUserSession { get; set; } = "start-user-session";
        public string EndUserSession { get; set; } = "end-user-session";
        public string GetSessionExpiration { get; set; } = "get-session-expiration";
        public string Exchange { get; set; } = "exchange";
        public string Revoke { get; set; } = "revoke";
        public string GetFolderName { get; set; } = "get-folder-name";
        public string GetFolderPath { get; set; } = "get-folder-path";
        public string GetFileFormat { get; set; } = "get-file-format";
        public string SetFolderName { get; set; } = "set-folder-name";
        public string SetFolderPath { get; set; } = "set-folder-path";
        public string SetFileFormat { get; set; } = "set-file-format";
        public string GetOutputJson { get; set; } = "get-output-json";
        public string ToggleOutputJson { get; set; } = "toggle-output-json";
        public string GetAutoSave { get; set; } = "get-auto-save";
        public string ToggleAutoSave { get; set; } = "toggle-auto-save";
        public string Invite { get; set; } = "invite-user";
        public string MoveRootContent { get; set; } = "move-root-content";
        public string ChangeLogin { get; set; } = "change-primary-email";
        public string AddEmailAlias { get; set; } = "add-email-alias";
        public string GetEmailAliases { get; set; } = "get-email-aliases";
        public string DeleteEmailAlias { get; set; } = "delete-email-alias";
        public string GetPending { get; set; } = "get-pending";
        public string ListForGroup { get; set; } = "list-for-group";
        public string UpdatePrivateKeyPath { get; set; } = "update-private-key-path";
        public string UpdateConfigFilePath { get; set; } = "update-config-file-path";
    }
}