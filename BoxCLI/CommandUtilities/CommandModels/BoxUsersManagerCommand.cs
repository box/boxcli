using System;
using System.Linq;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Auth;
using Box.V2.Config;
using Box.V2.Converter;
using Box.V2.Managers;
using Box.V2.Models;
using Box.V2.Services;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxUsersManagerCommand : BoxUsersManager
    {
        public BoxUsersManagerCommand(IBoxConfig config, IBoxService service, IBoxConverter converter, IAuthRepository auth, string asUser = null, bool? suppressNotifications = default(bool?))
            : base(config, service, converter, auth, asUser, suppressNotifications)
        {
        }

        public async Task<BoxUser> RemoveFromEnterprise(string userId)
        {
            var updateUserUri = new Uri($"{Constants.UserEndpointString}{userId}");
            var request = new BoxRequest(updateUserUri);
            request.Method = RequestMethod.Put;
            request.Payload = "{\"enterprise\": null}";

            IBoxResponse<BoxUser> response = await ToResponseAsync<BoxUser>(request).ConfigureAwait(false);

            return response.ResponseObject;
        }
    }
}