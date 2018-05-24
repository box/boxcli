using Box.V2.Models;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxStoragePolicyAssignmentRequest
    {
        [JsonProperty(PropertyName = "user_id")]
        public string UserId { get; set; }

        [JsonProperty(PropertyName = "storage_policy_id")]
        public string StoragePolicyId { get; set; }
    }
}