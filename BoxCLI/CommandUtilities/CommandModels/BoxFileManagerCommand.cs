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
    public class BoxFileManagerCommand : BoxFilesManager
    {
        public BoxFileManagerCommand(IBoxConfig config, IBoxService service, IBoxConverter converter, IAuthRepository auth, string asUser = null, bool? suppressNotifications = default(bool?))
            : base(config, service, converter, auth, asUser, suppressNotifications)
        {
        }

        public async Task<BoxFileUploadSession> CreateNewVersionUploadSessionAsync(string fileId, long fileSize)
        {
            var uploadUri = new Uri(string.Format(Constants.FilesNewVersionUploadSessionEndpointString, fileId));

            var request = new BoxRequest(uploadUri);
            request.Method = RequestMethod.Post;
            request.Payload = "{\"file_size\":" + fileSize + "}";

            IBoxResponse<BoxFileUploadSession> response = await ToResponseAsync<BoxFileUploadSession>(request).ConfigureAwait(false);

            return response.ResponseObject;
        }

        public async new Task<dynamic> CommitSessionAsync(Uri commitSessionUrl, string sha, BoxSessionParts sessionPartsInfo)
        {
            BoxRequest request = new BoxRequest(commitSessionUrl);
            request.Method = RequestMethod.Post;
            request.HttpHeaders.Add(Constants.RequestParameters.Digest, "sha=" + sha);
            request.Payload = _converter.Serialize(sessionPartsInfo);

            request.ContentType = Constants.RequestParameters.ContentTypeJson;

            var response = await ToResponseAsync<BoxFile>(request).ConfigureAwait(false);
            return response.ResponseObject;
        }

    }
}